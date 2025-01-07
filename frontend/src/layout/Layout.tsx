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
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <ButtonAppBar onMenuClick={handleDrawerToggle} />

        {/* モバイル用Sidebar */}
        {isMobile && (
          <Sidebar
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}

        {/* デスクトップ用Sidebar */}
        {!isMobile && (
          <Sidebar
            variant="permanent"
            open={true}
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
          }}
        >
          {children}
        </Box>
      </Box>
      <AddButton />
    </ThemeProvider>
  );
};

export default Layout;
