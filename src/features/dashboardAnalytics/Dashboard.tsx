import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { TextField, Button, Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { io } from 'socket.io-client';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);


const fetchStats = async () => {
  const res = await fetch('http://localhost:15000/NwidgetBackend/clients/stats');
  return res.json();
};

const fetchWeekly = async () => {
  const res = await fetch('http://localhost:15000/NwidgetBackend/clients/weekly');
  return res.json();
};

const fetchByCountry = async () => {
  const res = await fetch('http://localhost:15000/NwidgetBackend/clients/stats');
  return res.json();
};

const fetchClientsInRange = async (start, end) => {
  const res = await fetch(`http://localhost:15000/NwidgetBackend/clients/range?start=${start}&end=${end}`);
  return res.json();
};

const Dashboard = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rangeOption, setRangeOption] = useState('');
  const [liveData, setLiveData] = useState('');
  const [showRangeResults, setShowRangeResults] = useState(false);

  
  const { data: statsData, isLoading: statsLoading } = useQuery('stats', fetchStats);
  const { data: weeklyData, isLoading: weeklyLoading } = useQuery('weekly', fetchWeekly);
  const { data: countryData, isLoading: countryLoading } = useQuery('clientsByCountry', fetchByCountry);
  
  const { data: rangeData, refetch: fetchRangeData } = useQuery(
    ['clientsInRange', startDate, endDate],
    () => fetchClientsInRange(startDate, endDate),
    { enabled: false }
  );

  
  const [activeFrontUsers, setActiveFrontUsers] = useState(null);

  useEffect(() => {
      const socket = io('http://localhost:15000');

      socket.on('connect', () => {
          console.log(' WebSocket Connected:', socket.id);
      });

      // live
      socket.on('liveClients', (data) => {
          console.log(" Received liveClients event:", data);
          if (data && typeof data.count === "number") {
              setActiveFrontUsers(data.count); 
          }
      });

      return () => {
          socket.disconnect(); 
      };
  }, []);


  if (statsLoading || weeklyLoading || countryLoading) {
    return <div>Loading...</div>;
  }

  
  const handleApplyRange = () => {
    if (startDate && endDate) {
      fetchRangeData();
      setShowRangeResults(true);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Analytics Dashboard</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-lg bg-white">
          <CardContent>
            <Typography variant="h6" className="font-semibold text-gray-700">Total Clients</Typography>
            <Typography variant="h5" className="text-gray-900 font-bold">{statsData?.totalClients || 0}</Typography>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-white">
          <CardContent>
            <Typography variant="h6" className="font-semibold text-gray-700">Messages Sent by Clients</Typography>
            <Typography variant="h5" className="text-gray-900 font-bold">{statsData?.clientMessages || 0}</Typography>
          </CardContent>
        </Card>
      </div>

      {/* Selection */}
      <div className="w-full md:w-1/3 mb-6">
        <FormControl fullWidth>
          <InputLabel>View Mode</InputLabel>
          <Select
            value={rangeOption}
            onChange={(e) => setRangeOption(e.target.value)}
            label="View Mode"
          >
            <MenuItem value="live">Live Now</MenuItem>
            <MenuItem value="range">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Live Clients*/}
{rangeOption === 'live' && (
    <Card className="shadow-lg bg-blue-100 border border-blue-300 mb-6">
        <CardContent>
            <Typography variant="h6" className="font-semibold text-blue-700">Live Users on Front Widget</Typography>
            <Typography variant="h4" className="text-blue-900 font-bold">{activeFrontUsers}</Typography>
            <Typography variant="body2" className="text-gray-600">Currently active users on the front widget</Typography>
        </CardContent>
    </Card>
)}


      {/* Date Range Picker  */}
      {rangeOption === 'range' && (
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex space-x-4">
            <TextField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Button variant="contained" color="primary" onClick={handleApplyRange}>Apply Range</Button>
          </div>
        </div>
      )}

      {/* Clients in Selected Range  */}
      {showRangeResults && rangeOption === 'range' && (
        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="font-semibold">Clients in Selected Range</Typography>
            <Typography variant="h5">{rangeData?.clientsInRange || 0}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Weekly Clients Chart */}
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" className="font-semibold">Clients Per Week</Typography>
          <div style={{ width: '600px', height: '300px' }}>
            <Line data={{
              labels: weeklyData?.clientsLast7Days.map(item => item._id),
              datasets: [
                {
                  label: 'Clients Per Day',
                  data: weeklyData?.clientsLast7Days.map(item => item.count),
                  borderColor: theme.palette.primary.main,
                  fill: false,
                  tension: 0.1,
                },
              ],
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </CardContent>
      </Card>

      {/* Clients by Country  */}
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">Clients by Country</Typography>
          <div style={{ width: '350px', height: '350px', margin: 'auto' }}>
            <Pie data={{
              labels: countryData?.clientsByCountry.map(item => item.countryCode),
              datasets: [
                {
                  data: countryData?.clientsByCountry.map(item => item.count),
                  backgroundColor: ['#B2DFDB', '#FFB6B9', '#F8E1D4', '#FCE7A0', '#C4E1FF'],
                },
              ],
            }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
