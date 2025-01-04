import { useState, useEffect } from 'react';
import { Box, Typography, Card, Container, Grid, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import requests from '../utils/endpoints';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    lastLogin: '',
    // 他のユーザーデータをここに追加
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(requests.userData);
        setUserData(response.data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
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
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            ダッシュボード
          </Typography>
          
          <Grid container spacing={3}>
            {/* ユーザー情報カード */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ユーザー情報
                </Typography>
                <Typography>
                  ユーザー名: {userData.username}
                </Typography>
                <Typography>
                  最終ログイン: {userData.lastLogin}
                </Typography>
              </Card>
            </Grid>

            {/* 統計情報カード */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  統計情報
                </Typography>
                <Typography>
                  ここに統計データを表示
                </Typography>
              </Card>
            </Grid>

            {/* アクティビティカード */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  最近のアクティビティ
                </Typography>
                <Typography>
                  アクティビティログをここに表示
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;