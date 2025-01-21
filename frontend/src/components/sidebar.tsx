import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

import { logout } from '../lib/localStorage';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: "permanent" | "temporary";
}

const drawerWidth = 240;

export default function Sidebar({ open, onClose, variant }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { text: 'ダッシュボード', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'カレンダー', icon: <CalendarMonthIcon />, path: '/calendar' },
    { text: 'タグ設定', icon: <LocalOfferIcon />, path: '/tag-setting' },
    { text: '履歴一覧', icon: <HistoryIcon />, path: '/history' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === "temporary") {
      onClose();
    }
  };

  return(
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: variant === "permanent" ? drawerWidth : "auto",
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{
          overflow: 'auto',
          mt: 8,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
          }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
