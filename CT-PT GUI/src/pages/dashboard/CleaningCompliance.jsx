import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const complianceData = {
  totalUnits: 2458,
  cleaned:    { count: 1927, pct: 78.45 },
  notCleaned: { count: 262,  pct: 10.67 },
  pending:    { count: 269,  pct: 10.88 },
}

const CleaningCompliance = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: () => `{pct|${complianceData.cleaned.pct}%}\n{label|Cleaning %}`,
            rich: {
              pct:   { fontSize: 17, fontWeight: 600, color: '#111827', lineHeight: 28 },
              label: { fontSize: 11, color: '#6B7280', lineHeight: 18 },
            },
          },
          emphasis: { label: { show: true } },
          labelLine: { show: false },
          data: [
            { value: complianceData.cleaned.count,    name: 'Cleaned Units',     itemStyle: { color: '#16A34A' } },
            { value: complianceData.notCleaned.count, name: 'Not Cleaned Units', itemStyle: { color: '#DC2626' } },
            { value: complianceData.pending.count,    name: 'Pending Units',     itemStyle: { color: '#F59E0B' } },
          ],
        },
      ],
    })

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(chartRef.current)
    return () => { ro.disconnect(); chart.dispose() }
  }, [])

  return (
    <div className="compliance-card">
      <h6 className="compliance-title">Cleaning Compliance (Today)</h6>
      <div className="compliance-body">
        <div ref={chartRef} className="compliance-chart" />
        <div className="compliance-legend">
          <div className="legend-item">
            <span className="dot dot-green" />
            <div>
              <div className="legend-label">Cleaned Units</div>
              <div className="legend-value">{complianceData.cleaned.count.toLocaleString()} ({complianceData.cleaned.pct}%)</div>
            </div>
          </div>
          <div className="legend-item">
            <span className="dot dot-red" />
            <div>
              <div className="legend-label">Not Cleaned Units</div>
              <div className="legend-value">{complianceData.notCleaned.count} ({complianceData.notCleaned.pct}%)</div>
            </div>
          </div>
          <div className="legend-item">
            <span className="dot dot-yellow" />
            <div>
              <div className="legend-label">Pending Units</div>
              <div className="legend-value">{complianceData.pending.count} ({complianceData.pending.pct}%)</div>
            </div>
          </div>
        </div>
      </div>
      <div className="compliance-total">
        <span className="total-label">Total Units</span>
        <span className="total-value">{complianceData.totalUnits.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default CleaningCompliance