import { Bolt, FilterFrames, MenuBook, Person } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from './Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'react-query';
import { changePassword, getProfile, uploadProfile } from '../actions';
import { toast } from 'react-toastify';
import { handleKeyDown } from '../helpers';

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
      .min(6, 'Password must be atleast 6 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*\d).*$/,
        'Password must contain at least one uppercase letter and one number'
      ),
    confirm_password: z.string().nonempty('Field is required')
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password']
  });

const LogoutModal = ({ onClose, open }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.href = '/';
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleLogout)}
    >
      <DialogTitle>Logout</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Typography>Are you sure you want to logout?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleLogout}>Log out</Button>
      </DialogActions>
    </Dialog>
  );
};

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
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
    >
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
  const [logout, setLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState('');
  const { pathname } = useLocation();

  const isAdmin = pathname.includes('admin');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('profile'));

  const userProfileQuery = useQuery('userProfile', () => getProfile(user.id));

  const handleClose = () => {
    setAnchorEl(null);
  };

  const uploadProfileMutation = useMutation(uploadProfile, {
    onSuccess: () => window.location.reload(),
    onError: () => toast.error('Something went wrong!')
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    const payload = {
      user_id: user.id,
      desc: 'desc',
      profile_picture: file.name,
      modified_by: user.email
    };

    uploadProfileMutation.mutate({ payload, file });
  };

  useEffect(() => {
    if (!userProfileQuery.isLoading) {
      setProfile(userProfileQuery.data?.[0]?.profile_picture);
    }
  }, [userProfileQuery.isLoading, userProfileQuery.data]);

  return (
    <>
      <LogoutModal open={logout} onClose={() => setLogout(false)} />
      <ChangePasswordModal onClose={() => setOpen(false)} open={open} />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          elevation={0}
          position="fixed"
          sx={{
            bgcolor: 'white',
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
                <Avatar
                  sx={{ cursor: 'pointer', height: 32, width: 32 }}
                  onClick={handleMenu}
                  src={`https://filestoragewebapi-production.up.railway.app${profile}`}
                />
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
                  <MenuItem onClick={() => setLogout(true)}>Logout</MenuItem>
                  {!userProfileQuery.data?.length && (
                    <MenuItem>
                      <label>
                        Add Profile Picture
                        <input type="file" hidden onChange={handleFileChange} />
                      </label>
                    </MenuItem>
                  )}
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
            <Toolbar>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <Bolt color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Math E-turo
                </Typography>
              </Box>
            </Toolbar>
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
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('user/about')}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="About" />
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
