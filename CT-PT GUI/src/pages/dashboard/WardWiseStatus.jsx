import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
// import './WardWiseStatus.css'

const wardData = [
  { ward: "Ward 1", total: 456, cleaned: 368, pending: 52, notCleaned: 36 },
  { ward: "Ward 2", total: 392, cleaned: 311, pending: 41, notCleaned: 40 },
  { ward: "Ward 3", total: 578, cleaned: 452, pending: 63, notCleaned: 63 },
  { ward: "Ward 4", total: 287, cleaned: 214, pending: 38, notCleaned: 35 },
  { ward: "Ward 5", total: 355, cleaned: 276, pending: 41, notCleaned: 38 },
  { ward: "Ward 6", total: 218, cleaned: 165, pending: 23, notCleaned: 30 },
  { ward: "Ward 8", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 9", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 10", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 11", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 12", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 13", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 14", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 15", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 16", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 17", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 18", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
  { ward: "Ward 19", total: 172, cleaned: 141, pending: 11, notCleaned: 20 },
];

const WardWiseStatus = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    chart.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: ["Cleaned", "Not Cleaned", "Pending"],
        top: 4,
        left: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 11, color: "#6B7280" },
      },
      grid: { top: 36, left: 10, right: 10, bottom: 10, containLabel: true },
      xAxis: {
        type: "category",
        data: wardData.map((w) => w.ward),
        axisLabel: {
          fontSize: 9,
          color: "#6B7280",
          interval: 0,
          rotate: 40,
        },
        axisLine: { lineStyle: { color: "#E5E7EB" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { fontSize: 10, color: "#9CA3AF" },
        splitLine: { lineStyle: { color: "#F3F4F6" } },
      },
      series: [
        {
          name: "Cleaned",
          type: "bar",
          data: wardData.map((w) => w.cleaned),
          itemStyle: { color: "#16A34A", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
        {
          name: "Not Cleaned",
          type: "bar",
          data: wardData.map((w) => w.notCleaned),
          itemStyle: { color: "#DC2626", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
        {
          name: "Pending",
          type: "bar",
          data: wardData.map((w) => w.pending),
          itemStyle: { color: "#F59E0B", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
      ],
    });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(chartRef.current);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
  }, []);

  return (
    <div className="ward-card">
      <h6 className="ward-title">Ward Wise Cleaning Status</h6>
      <div ref={chartRef} className="ward-chart" />
    </div>
  );
};

export default WardWiseStatus;
