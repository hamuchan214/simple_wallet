import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CssBaseline,
  FormControl,
  Link,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import axiosInstance, { setAuthToken } from "../utils/axios";
import requests from "../utils/endpoints";
import { AxiosError } from "axios";

// ダークテーマ定義
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// カスタムカードコンポーネント
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

// LoginForm コンポーネント
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setErrorMsg("");

    try {
      const response = await axiosInstance.post(requests.login, {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, id } = response.data;

        setAuthToken(token);
        localStorage.setItem("userId", id);
        localStorage.setItem("username", username);

        console.log(username);

        setIsSuccess(true);

        // 1秒後にダッシュボードへ移動
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("ログイン失敗:", error);
      setIsSuccess(false);

      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 401:
            setErrorMsg("ユーザー名またはパスワードが間違っています");
            break;
          case 404:
            setErrorMsg("ユーザーが見つかりません");
            break;
          default:
            setErrorMsg("ログインに失敗しました");
        }
      } else {
        setErrorMsg("サーバーに接続できません");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <StyledCard variant="outlined">
          <Typography variant="h4" align="left" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            onSubmit={handleLogin}
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
              color={isSuccess ? "success" : "primary"}
              fullWidth
              sx={{ marginTop: "16px", height: "56px" }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSuccess ? (
                "ログイン成功！"
              ) : (
                "ログイン"
              )}
            </Button>
          </Box>
          <Link
            component={Button}
            variant="body2"
            sx={{ alignSelf: "center", marginTop: 1 }}
            onClick={handleForgotPasswordOpen}
          >
            パスワードをお忘れですか?
          </Link>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: "center" }}>
            アカウントが未登録ですか？
            <RouterLink
              to="/register"
              style={{ marginLeft: '4px' }}
            >
              新規登録
            </RouterLink>
          </Typography>
        </StyledCard>
      </Container>
      <ForgotPassword
        open={forgotPasswordOpen}
        handleClose={handleForgotPasswordClose}
      />
    </ThemeProvider>
  );
};

export default LoginForm;
