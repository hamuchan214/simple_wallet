import { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CssBaseline, FormControl, FormLabel, Link, CircularProgress, Divider } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import ForgotPassword from './ForgotPassword';
import axios from 'axios';
import requests from '../utils/endpoints';


const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;