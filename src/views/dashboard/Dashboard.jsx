import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "../../services/axiosClient";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  faCalendarDay,
  faClock,
  faHourglassHalf,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

/* =======================
   Stat Card
======================= */
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex items-center gap-4">
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}
    >
      <FontAwesomeIcon icon={icon} className="text-white text-xl" />
    </div>

    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {value ?? "-"}
      </p>
    </div>
  </div>
);

/* =======================
   Dashboard
======================= */
const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [rawChartData, setRawChartData] = useState([]);
  const [mode, setMode] = useState("date"); // date | month

  /* ===== Load summary ===== */
  useEffect(() => {
    axiosClient.get("/api/dashboard/summary").then((res) => {
      setStats(res.data || {});
    });
  }, []);

  /* ===== Load chart ===== */
  useEffect(() => {
    const url =
      mode === "date"
        ? "/api/dashboard/ticketsbydate"
        : "/api/dashboard/ticketsbymonth";

    axiosClient.get(url).then((res) => {
      setRawChartData(res.data || []);
    });
  }, [mode]);

  /* ===== Normalize chart data (IMPORTANT FIX) ===== */
  const chartData = rawChartData.map((item) => ({
    label:
      mode === "date"
        ? item.day || item.date
        : item.month || item.month_name || item.year_month,
    total: Number(item.total || item.count || 0),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{t("dashboard.title")}</h2>
        <p className="text-sm text-gray-500">
          {t("dashboard.overview")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label={t("dashboard.total_tickets")}
          value={stats?.totalTickets}
          icon={faTicket}
          color="bg-blue-500"
        />

        <StatCard
          label={t("dashboard.ticket_today")}
          value={stats?.totalTicketstoday}
          icon={faCalendarDay}
          color="bg-indigo-500"
        />

        <StatCard
          label={t("dashboard.ticket_pending")}
          value={stats?.totalTicketsopen}
          icon={faClock}
          color="bg-yellow-500"
        />

        <StatCard
          label={t("dashboard.waiting_approve")}
          value={stats?.totalTicketswatingapprove}
          icon={faHourglassHalf}
          color="bg-orange-500"
        />

        <StatCard
          label={t("dashboard.total_resolved")}
          value={stats?.totalTicketsResolved}
          icon={faCheckCircle}
          color="bg-green-500"
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("dashboard.tickets_chart")}
          </h3>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring"
          >
            <option value="date">{t("dashboard.last_7_days")}</option>
            <option value="month">{t("dashboard.by_month")}</option>
          </select>
        </div>

        {chartData.length === 0 ? (
          <p className="text-gray-400 text-sm">{t("dashboard.no_chart_data")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
