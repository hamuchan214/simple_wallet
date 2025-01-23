import { ReactNode } from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ButtonAppBar from '../components/appbar';
import Sidebar from '../components/sidebar';
import AddButton from '../components/addbutton';
import React from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface LayoutProps {
  children: ReactNode;
  hideAddButton?: boolean;
}

const Layout = ({ children, hideAddButton = false }: LayoutProps) => {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <ButtonAppBar onMenuClick={handleDrawerToggle} />

        {/* モバイルの場合 */}
        {isMobile && (
          <Sidebar
            variant="temporary"
            open={sidebarOpen}
            onClose={handleDrawerToggle}
          />
        )}

        {/* デスクトップの場合 */}
        {!isMobile && (
          <Sidebar
            variant="persistent"
            open={sidebarOpen}
            onClose={handleDrawerToggle}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: 'background.default',
            minHeight: '100vh',
            marginLeft: !isMobile ? (sidebarOpen ? '240px' : 0) : 0,  // 修正: 240pxを明示的に指定
            transition: theme => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
      {!hideAddButton && <AddButton />}
    </ThemeProvider>
  );
};

export default Layout;
