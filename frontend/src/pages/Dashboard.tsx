import { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    // ローカルストレージからユーザーデータを取得
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');

    if (!token || !id || !name) {
      // トークンがない場合、ログインページへリダイレクト
      navigate('/');
      return;
    }

    // ユーザーデータを状態に設定
    setUserData({
      id: parseInt(id, 10),
      name,
    });
  }, [navigate]);

  if (!userData) {
    // ローディング状態やログインエラー時の表示
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
      <Container>

      </Container>
    </Layout>
  );
};

export default Dashboard;
