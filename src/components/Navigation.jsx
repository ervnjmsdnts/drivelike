import { AccountCircle, FilterFrames, MenuBook } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Stack,
  Toolbar
  // alpha,
  // styled
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from './Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { changePassword } from '../actions';
import { toast } from 'react-toastify';

const drawerWidth = 240;

const changePasswordSchema = z
  .object({
    old_password: z
      .string()
      .nonempty({ message: 'Field is required' })
      .min(6, 'Password must be atleast 6 characters'),
    new_password: z
      .string()
      .nonempty({ message: 'Field is required' })
      .min(6, 'Password must be atleast 6 characters'),
    confirm_password: z.string().nonempty('Field is required')
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password']
  });

const ChangePasswordModal = ({ onClose, open }) => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const confirmPasswordMutation = useMutation(changePassword, {
    onSuccess: () => {
      toast.success('Password changed');
      onClose();
    },
    onError: () => toast.error('Something went wrong!')
  });

  const user = JSON.parse(localStorage.getItem('profile'));

  const onSubmit = (data) => {
    confirmPasswordMutation.mutate({
      userId: user.public_id,
      payload: { ...data }
    });
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Password</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Stack sx={{ pt: 1 }} gap={2}>
          <Input
            size="small"
            label="Old Password"
            type="password"
            {...register('old_password')}
            errors={errors.old_password}
          />
          <Input
            size="small"
            label="New Password"
            type="password"
            {...register('new_password')}
            errors={errors.new_password}
          />
          <Input
            size="small"
            label="Confirm Password"
            type="password"
            {...register('confirm_password')}
            errors={errors.confirm_password}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

const Navigation = ({ children }) => {
  const [open, setOpen] = useState(false);
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
    <>
      <ChangePasswordModal onClose={() => setOpen(false)} open={open} />
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
                  <MenuItem onClick={() => setOpen(true)}>
                    Change Password
                  </MenuItem>
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
    </>
  );
};

export default Navigation;
