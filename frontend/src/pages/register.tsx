import React from "react";
import { Box, Button, TextField, Typography, Card, CssBaseline, FormControl, Link, CircularProgress, Divider } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import requests from "../utils/endpoints";
import { setAuthToken } from "../utils/axios";

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

const Register = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setErrorMsg('');

    try {
      const response = await axios.post(requests.register, {
        username,
        password
      });

      if (response.status === 201) {
        const { token, id, username } = response.data;
        setAuthToken(token);
        localStorage.setItem('userId', id);
        localStorage.setItem('username', username);
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      setIsSuccess(false);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMsg('ユーザー名またはパスワードが無効です');
            break;
          case 409:
            setErrorMsg('このユーザー名は既に使用されています');
            break;
          default:
            setErrorMsg('登録に失敗しました');
        }
      } else {
        setErrorMsg('サーバーに接続できません');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <StyledCard variant="outlined">
          <Typography variant="h4" align="left" gutterBottom>
            Register
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            onSubmit={handleRegister}
          >
            {errorMsg && (
              <Typography color="error" textAlign="center">
                {errorMsg}
              </Typography>
            )}
            
            <FormControl>
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
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSuccess ? (
                '登録成功！'
              ) : (
                '登録する'
              )}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: 'center' }}>
            既にアカウントをお持ちですか？
            <Link 
              href="/" 
              variant="body2" 
              sx={{alignSelf: 'center', marginLeft: 1}}
            >
              ログイン
            </Link>
          </Typography>
        </StyledCard>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
