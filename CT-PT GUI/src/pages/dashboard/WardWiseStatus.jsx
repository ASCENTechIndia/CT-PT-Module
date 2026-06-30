import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import apiClient from "../../services/apiClient";
import { useLoader } from "../../context/LoaderContext";
import { useAuth } from "../../context/AuthContext";

const WardWiseStatus = ({ filters }) => {
  const { user } = useAuth();
  const ulbId = user?.orgId || "";
  const userId = user?.userId || "";
  const { setLoader } = useLoader();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const buildParams = () => {
    const params = new URLSearchParams();
    params.append("ulbId", ulbId);
    params.append("userId", userId);
    params.append("fromDate", formatDateForApi(filters.fromDate) || "");
    params.append("toDate", formatDateForApi(filters.toDate) || "");
    if (filters.ward) params.append("ward", filters.ward);
    params.append("vendor", filters.vendor);
    params.append("complaintStatus", filters.complaintStatus);
    params.append("userType", "SI")
    return params;
  };

  const fetchData = async () => {
    if (!ulbId || !userId) {
      setLoading(false);
      return;
    }
    try {
      setLoader(true);
      setLoading(true);
      const params = buildParams();
      const response = await apiClient.get(
        `/dashboard/ward-wise-cleaning-status?${params.toString()}`,
      );

      if (response.success && Array.isArray(response.data?.data)) {
        setChartData(response.data.data);
      } else {
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching ward wise status:", err);
      setChartData([]);
    } finally {
      setLoader(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ulbId, userId, filters.fromDate, filters.toDate, filters.ward]);

  // Cleanup chart instance on unmount only
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);

      const ro = new ResizeObserver(() => {
        chartInstance.current?.resize();
      });
      ro.observe(chartRef.current);

      chartInstance.current.__resizeObserver = ro;
    }

    const wards = chartData.map((item) => `Ward ${item.WARDS}`);
    const cleaned = chartData.map((item) => item.CLEANED || 0);
    const notCleaned = chartData.map((item) => item.NOT_CLEANED || 0);
    const pending = chartData.map((item) => item.PENDING || 0);
    const rejected = chartData.map((item) => item.REJECTED || 0);

    chartInstance.current.setOption({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: ["Cleaned", "Not Cleaned", "Pending", "Rejected"],
        top: 4,
        left: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 11, color: "#6B7280" },
      },
      grid: { top: 36, left: 10, right: 10, bottom: 10, containLabel: true },
      xAxis: {
        type: "category",
        data: wards,
        axisLabel: { fontSize: 9, color: "#6B7280", interval: 0, rotate: 40 },
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
          data: cleaned,
          itemStyle: { color: "#16A34A", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
        {
          name: "Not Cleaned",
          type: "bar",
          data: notCleaned,
          itemStyle: { color: "#DC2626", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
        {
          name: "Pending",
          type: "bar",
          data: pending,
          itemStyle: { color: "#F59E0B", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
        {
          name: "Rejected",
          type: "bar",
          data: rejected,
          itemStyle: { color: "#8B5CF6", borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 10,
        },
      ],
    });

    chartInstance.current.resize();
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="ward-card">
        <h6 className="ward-title">Ward Wise Cleaning Status</h6>
        <p className="text-muted text-center py-3">No data available</p>
      </div>
    );
  }

  return (
    <div className="ward-card">
      <h6 className="ward-title">Ward Wise Cleaning Status</h6>
      <div ref={chartRef} className="ward-chart" />
    </div>
  );
};

export default WardWiseStatus;
