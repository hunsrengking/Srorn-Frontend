import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import printCardService from "@/services/printCardService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserGraduate, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const PrintCard = () => {
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const res = await printCardService.getPrintCardStats();
      setStatsData(res.data || []);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // 1. Gather all dynamic categories (Card + Cable (color))
  const statsCategories = React.useMemo(() => {
    const categories = ["Card"];
    statsData.forEach((item) => {
      if (item.Cable && Array.isArray(item.Cable)) {
        item.Cable.forEach((c) => {
          if (c.color) {
            // Capitalize color name to look nice, e.g. "red" -> "Red"
            const capitalizedColor = c.color.charAt(0).toUpperCase() + c.color.slice(1);
            const catName = `Cable (${capitalizedColor})`;
            if (!categories.includes(catName)) {
              categories.push(catName);
            }
          }
        });
      }
    });
    return categories;
  }, [statsData]);

  // 2. Preprocess data for Recharts BarChart & Table (handling month label formatting)
  const chartData = React.useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return statsData.map((item) => {
      const [year, month] = (item.month || "").split("-");
      const monthIndex = parseInt(month, 10) - 1;
      const label =
        monthIndex >= 0 && monthIndex < 12
          ? `${monthNames[monthIndex]}-${year}`
          : item.month;

      const dataObj = {
        month: item.month,
        label: label,
        Card: item.total_card || 0,
      };

      if (item.Cable && Array.isArray(item.Cable)) {
        item.Cable.forEach((c) => {
          if (c.color) {
            const capitalizedColor = c.color.charAt(0).toUpperCase() + c.color.slice(1);
            dataObj[`Cable (${capitalizedColor})`] = c.total || 0;
          }
        });
      }

      return dataObj;
    });
  }, [statsData]);

  // 3. Helper to get cell value for a specific category in table rendering
  const getCellValue = (category, monthIndex) => {
    const dataObj = chartData[monthIndex];
    if (!dataObj) return 0;
    return dataObj[category] || 0;
  };

  return (
    <div className="space-y-5">
      {/* Page Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faAddressCard} />
              {t("print_card.title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("print_card.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                           font-medium rounded-xl bg-blue-600 text-white shadow-sm
                           hover:bg-blue-700 focus:outline-none focus:ring-2
                           focus:ring-blue-500/50 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>{t("print_card.print_new")}</span>
                <svg
                  className={`ml-1 h-3.5 w-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  {/* Overlay to close the dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-100 ring-1 ring-black/5 focus:outline-none z-20 overflow-hidden"
                  >
                    <div className="py-1">
                      <Link
                        to="/students"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                      >
                        <FontAwesomeIcon icon={faUserGraduate} className="text-slate-400 h-4 w-4" />
                        Student
                      </Link>
                      <Link
                        to="/settings/employees"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                      >
                        <FontAwesomeIcon icon={faUserTie} className="text-slate-400 h-4 w-4" />
                        Teacher
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Print Statistics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly breakdown of cards and cable colors printed
            </p>
          </div>
        </div>

        {statsLoading ? (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
            Loading statistics...
          </div>
        ) : statsData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
            No statistics data available
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="min-w-full text-sm text-center border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <tr>
                    <th className="px-3 py-2 text-left border border-slate-100 bg-slate-100 min-w-[100px]">Item</th>
                    {chartData.map((item) => (
                      <th key={item.month} className="px-3 py-2 border border-slate-100 min-w-[80px]">
                        {item.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {statsCategories.map((category) => {
                    // Dynamically set row styles and color badges based on category name
                    let cellBg = "bg-slate-50 text-slate-800 border-slate-100";
                    if (category.includes("Green")) {
                      cellBg = "bg-emerald-50 text-emerald-800 border-emerald-100";
                    } else if (category.includes("Red")) {
                      cellBg = "bg-rose-50 text-rose-800 border-rose-100";
                    } else if (category.includes("Yellow")) {
                      cellBg = "bg-amber-50 text-amber-800 border-amber-100";
                    } else if (category.includes("Black")) {
                      cellBg = "bg-slate-900 text-slate-100 border-slate-900";
                    } else if (category.includes("Blue")) {
                      cellBg = "bg-blue-50 text-blue-800 border-blue-100";
                    }

                    return (
                      <tr key={category}>
                        <td className={`px-3 py-3 text-left border border-slate-100 font-semibold ${cellBg}`}>
                          {category}
                        </td>
                        {chartData.map((item, idx) => (
                          <td key={item.month} className="px-3 py-3 border border-slate-100 text-slate-700 text-base">
                            {getCellValue(category, idx)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Recharts Bar Chart */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fill: "#64748b", fontSize: 11 }} 
                    stroke="#cbd5e1"
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: "#64748b", fontSize: 11 }} 
                    stroke="#cbd5e1"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      borderRadius: "12px", 
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
                  />
                  {statsCategories.map((category) => {
                    // Dynamically map colors matching database values
                    let fill = "#3b82f6"; // default blue
                    let stroke = undefined;
                    let strokeWidth = undefined;

                    if (category === "Card") {
                      fill = "#f8fafc";
                      stroke = "#94a3b8";
                      strokeWidth = 1.5;
                    } else if (category.includes("Green")) {
                      fill = "#10b981";
                    } else if (category.includes("Red")) {
                      fill = "#ef4444";
                    } else if (category.includes("Yellow")) {
                      fill = "#f59e0b";
                    } else if (category.includes("Black")) {
                      fill = "#1e293b";
                    } else if (category.includes("Blue")) {
                      fill = "#3b82f6";
                    }

                    return (
                      <Bar 
                        key={category}
                        dataKey={category} 
                        name={category} 
                        fill={fill} 
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={25}
                      />
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintCard;
