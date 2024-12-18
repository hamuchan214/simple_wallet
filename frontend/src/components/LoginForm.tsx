import { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CssBaseline, FormControl, FormLabel, Link, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import ForgotPassword from './ForgotPassword';

// ダークテーマ定義
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// カスタムカードコンポーネント
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

// LoginForm コンポーネント
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    // ログイン処理（例: サーバーにリクエスト送信）
    try {
      console.log('Login attempt:', { username, password });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 模擬的な2秒間の処理待ち
      setIsSuccess(true); // 成功フラグをセット
    } catch (error) {
      console.error('Login failed:', error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <StyledCard variant="outlined">
          <Typography variant="h4" align="left" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            onSubmit={handleLogin}
          >
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                color="primary"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="primary"
              />
            </FormControl>
            <Button
              variant="contained"
              color={isSuccess ? 'success' : 'primary'}
              fullWidth
              sx={{ marginTop: '16px', height: '56px' }}
              type='submit'
              disabled={isLoading}
              onClick={handleLogin}
            >
              {isLoading ? <CircularProgress size={24} color='inherit' /> : isSuccess ? 'Success' : 'Login'}
            </Button>
          </Box>
          <Link component={Button} variant="body2" sx={{alignSelf: 'center', marginTop: 1}} onClick={handleForgotPasswordOpen}>
            パスワードをお忘れですか?
          </Link>
        </StyledCard>
      </Container>
      <ForgotPassword open={forgotPasswordOpen} handleClose={handleForgotPasswordClose} />
    </ThemeProvider>
  );
};

export default LoginForm;
