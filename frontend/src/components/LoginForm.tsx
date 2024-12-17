import { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent, CssBaseline, FormControl, FormLabel } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import ForgotPassword from './ForgotPassword';  // ForgotPasswordが必要なら

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

  const handleLogin = () => {
    console.log('Login attempt:', { username, password });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <StyledCard variant="outlined">
          <Typography variant="h4" align="center" gutterBottom>
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
              color="primary"
              fullWidth
              sx={{ marginTop: '16px' }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </StyledCard>
      </Container>
    </ThemeProvider>
  );
};

export default LoginForm;
