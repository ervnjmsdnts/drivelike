import { AccountCircle, FilterFrames, MenuBook } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // InputBase,
  Menu,
  MenuItem,
  Toolbar
  // alpha,
  // styled
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Navigation = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { pathname } = useLocation();

  const isAdmin = pathname.includes('admin');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.href = '/';
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          width: isAdmin ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      {!isAdmin && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('user')}>
                <ListItemIcon>
                  <MenuBook />
                </ListItemIcon>
                <ListItemText primary="Materials" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('user/board')}>
                <ListItemIcon>
                  <FilterFrames />
                </ListItemIcon>
                <ListItemText primary="Board" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          height: '100%',
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Navigation;
