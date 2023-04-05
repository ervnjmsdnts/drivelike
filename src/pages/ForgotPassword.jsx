import { Box, Button, Typography } from '@mui/material';
import Input from '../components/Input';
import { Key } from '@mui/icons-material';
import ResetLayout from '../layouts/ResetLayout';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <ResetLayout>
      <Key color="primary" fontSize="large" />
      <Box textAlign="center">
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          Forgot password?
        </Typography>
        <Typography color="gray" sx={{ fontWeight: 'bold' }}>
          No Worries, we&apos;ll send you reset instructions
        </Typography>
      </Box>
      <Input label="Email" />
      <Button
        LinkComponent={Link}
        to="/set-new-password"
        variant="contained"
        fullWidth
        size="large"
      >
        Reset Password
      </Button>
    </ResetLayout>
  );
};

export default ForgotPassword;
