import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { FcComboChart } from "react-icons/fc";
import { FaRegClock, FaUsers } from "react-icons/fa";
import { MdOutlinePageview } from "react-icons/md";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedPage, setSelectedPage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      fetchStatistics();
    }
  }, [startDate, endDate]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError("");

    try {
      const requestUrl = `${import.meta.env.VITE_BACKEND_URL}/api/stats/getStatistics`;
      const response = await axios.get(requestUrl, {
        params: { startDate, endDate },
      });

      if (response.status === 200 && response.data.length > 0) {
        const formattedData = response.data.map((stat) => ({
          ...stat,
          duration: Number(stat.duration),
        }));

        const groupedData = groupDataByPage(formattedData);
        setStatistics(groupedData);
        setAggregatedData(aggregateTotalTimeByPage(groupedData));
      } else {
        setError("No data found for the selected date range.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch statistics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const groupDataByPage = (data) => {
    const groupedStats = {};
    data.forEach((stat) => {
      const page = stat.page || "Unknown Page";
      const user = stat.appClient?.identifier || "Unknown User";
      if (!groupedStats[page]) groupedStats[page] = {};
      if (!groupedStats[page][user]) groupedStats[page][user] = 0;
      groupedStats[page][user] += stat.duration;
    });
    return groupedStats;
  };

  const aggregateTotalTimeByPage = (groupedData) => {
    const totalTimeByPage = {};
    Object.keys(groupedData).forEach((page) => {
      totalTimeByPage[page] = Object.values(groupedData[page]).reduce((sum, time) => sum + time, 0);
    });
    return totalTimeByPage;
  };

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Time Spent",
        data: Object.values(aggregatedData),
        backgroundColor: "#33b8ff",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2"> <FcComboChart /> User Statistics Dashboard</h2>
      <div className="flex gap-4 mb-6">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />
      </div>
      {loading && <p className="text-blue-500 font-semibold">Loading data...</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
      {!loading && !error && Object.keys(aggregatedData).length > 0 && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <Bar data={chartData} />
        </div>
      )}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-4 text-left"><MdOutlinePageview /> Page</th>
              <th className="p-4 text-left"><FaRegClock /> Total Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(aggregatedData).map((page) => (
              <tr key={page} className="border-b hover:bg-gray-200 cursor-pointer" onClick={() => setSelectedPage(page)}>
                <td className="p-4">{page}</td>
                <td className="p-4 font-semibold">{aggregatedData[page].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPage && statistics[selectedPage] && (
        <div className="mt-8 border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-4 text-left"><FaUsers /> User ID</th>
                <th className="p-4 text-left"><FaRegClock /> Time Spent </th>NotFoundPage.tsx
              </tr>
            </thead>
            <tbody>
              {Object.keys(statistics[selectedPage]).map((user) => (
                <tr key={user} className="border-b hover:bg-gray-200">
                  <td className="p-4">{user}</td>
                  <td className="p-4 font-semibold">{statistics[selectedPage][user].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatisticsDashboard;