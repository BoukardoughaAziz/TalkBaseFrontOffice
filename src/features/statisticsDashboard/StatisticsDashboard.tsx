import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
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
      console.log("Sending request to:", requestUrl, { startDate, endDate });

      const response = await axios.get(requestUrl, {
        params: { startDate, endDate },
      });

      console.log("Response received:", response.data);

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
      console.error("Error fetching statistics:", error);
      setError(
        error.response?.data?.message || "Failed to fetch statistics. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const groupDataByPage = (data) => {
    const groupedStats = {};

    data.forEach((stat) => {
      const page = stat.page || "Unknown Page";
      const user = stat.appClient?.identifier || "Unknown User";

      if (!groupedStats[page]) {
        groupedStats[page] = {};
      }

      if (!groupedStats[page][user]) {
        groupedStats[page][user] = 0;
      }

      groupedStats[page][user] += stat.duration;
    });

    return groupedStats;
  };

  const aggregateTotalTimeByPage = (groupedData) => {
    const totalTimeByPage = {};
    Object.keys(groupedData).forEach((page) => {
      totalTimeByPage[page] = Object.values(groupedData[page]).reduce(
        (sum, time) => sum + time,
        0
      );
    });
    return totalTimeByPage;
  };

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Time Spent (s)",
        data: Object.values(aggregatedData),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Statistics</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && Object.keys(aggregatedData).length > 0 && (
        <Bar data={chartData} />
      )}

      <table className="w-full border-collapse border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Page</th>
            <th className="border border-gray-300 p-2">Total Time Spent (s)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(aggregatedData).map((page) => (
            <tr key={page} className="border border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedPage(page)}>
              <td className="p-2">{page}</td>
              <td className="p-2">{aggregatedData[page].toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPage && statistics[selectedPage] && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Users for: <span className="text-blue-500">{selectedPage}</span></h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">User ID</th>
                <th className="border border-gray-300 p-2">Time Spent (s)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(statistics[selectedPage]).map((user) => (
                <tr key={user} className="border border-gray-300">
                  <td className="p-2">{user}</td>
                  <td className="p-2">{statistics[selectedPage][user].toFixed(2)}</td>
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
