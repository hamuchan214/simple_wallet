import { useState, useEffect } from 'react';
import { Box, Typography, Card, Container,Grid2, CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import requests from '../utils/endpoints';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import ButtonAppBar from '../components/appbar';
import Sidebar from '../components/sidebar';
import AddButton from '../components/addbutton';

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
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/');
      return;
    }
  }, [navigate]);


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
        const response = await axios.get(requests.transactionData,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
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
      <Box sx={{ display: 'flex' }}>
        <ButtonAppBar onMenuClick={handleDrawerToggle} />
        
        {/* モバイル用Sidebar */}
        {isMobile && (
          <Sidebar
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}
        
        {/* デスクトップ用Sidebar */}
        {!isMobile && (
          <Sidebar
            variant="permanent"
            open={true}
            onClose={handleDrawerToggle}
          />
        )}
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Container>
            {/* ここにダッシュボードのコンテンツを配置 */}
          </Container>
        </Box>
      </Box>
      <AddButton />
    </ThemeProvider>
  );
};

export default Dashboard;