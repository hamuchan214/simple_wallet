import React from "react";
import { Box, Button, CssBaseline, TextField, Typography, Container, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import requests from "../utils/endpoints";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Register = () => {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    const data = {
      username,
      password
    };

    try {
      console.log('Sending request to:', requests.register);
      const response = await axios.post(requests.register, data);

      if (response.status === 201) {
        setIsSuccess(true);
        navigate("/");
      }
      if (response.status === 400) {
        setIsSuccess(false);
        console.log("Invalid username or password");
      }
      if (response.status === 409) {
        setIsSuccess(false);
        console.log("User already exists");
      }
    } catch (error) {
      console.error("Register failed:", error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {/* Corrected CssBaseline */}
      <CssBaseline />
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          新規登録
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={isLoading}
            onClick={handleRegister}
          >
            {isLoading ? <CircularProgress size={24} color='inherit' /> : isSuccess ? 'Success' : '登録する'}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
