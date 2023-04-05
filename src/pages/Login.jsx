import { Box, Button, Link, Stack, Typography } from '@mui/material';
import AuthInput from '../components/AuthInput';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          width: '40%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            marginX: '16px',
            borderRadius: '16px',
            padding: '16px'
          }}
        >
          <Stack gap="8px" width="100%">
            <Typography fontWeight="bold" mb="16px" variant="h4">
              Login
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap="16px"
            >
              <AuthInput label="Email" />
              <AuthInput label="Password" type="password" />
              <Button
                LinkComponent={RouterLink}
                to="/user"
                variant="contained"
                fullWidth
                size="large"
              >
                Log in
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <Link
                component={RouterLink}
                underline="none"
                to="forgot-password"
              >
                Forgot your password?
              </Link>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        backgroundColor="primary.main"
        alignItems="center"
      >
        <Typography variant="h2" color="white" fontWeight="bold">
          Welcome to Name
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
