import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';

interface ButtonAppBarProps {
  onMenuClick: () => void;
}

export default function ButtonAppBar({ onMenuClick }: ButtonAppBarProps) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <img  src={Logo} style={{objectFit:"contain",height:"50px"}}/>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          simple-wallet
        </Typography>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {username ? `ようこそ、${username}さん` : ''}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          ログアウト
        </Button>
      </Toolbar>
    </AppBar>
  );
}