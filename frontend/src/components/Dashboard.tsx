import { useState, useEffect } from 'react';
import { Box, Typography, Card, Container, Grid2, CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import requests from '../utils/endpoints';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface UserData {
  username: string;
  lastLogin: string;
  totalTransactions: number;
  recentActivities: Array<{
    id: number;
    type: string;
    date: string;
    description: string;
  }>;
  statistics: {
    dailyAverage: number;
    monthlyTotal: number;
    successRate: number;
  };
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    lastLogin: '',
    totalTransactions: 0,
    recentActivities: [],
    statistics: {
      dailyAverage: 0,
      monthlyTotal: 0,
      successRate: 0
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('データ取得開始');
        const response = await axios.get(requests.transactionData);
        console.log('取得したデータ:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('データ取得エラーの詳細:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>

      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;