import { Box, Button, Typography } from '@mui/material';
import Input from '../components/Input';
import { Key } from '@mui/icons-material';
import ResetLayout from '../layouts/ResetLayout';
import { Link } from 'react-router-dom';

const SetNewPassword = () => {
  return (
    <ResetLayout>
      <Key color="primary" fontSize="large" />
      <Box textAlign="center">
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          Set new password
        </Typography>
        <Typography color="gray" sx={{ fontWeight: 'bold' }}>
          Your new password must be different to previously used passwords.
        </Typography>
      </Box>
      <Input label="Password" type="password" />
      <Input label="Confirm password" type="password" />
      <Button
        LinkComponent={Link}
        to="/reset-success"
        variant="contained"
        fullWidth
        size="large"
      >
        Reset Password
      </Button>
    </ResetLayout>
  );
};

export default SetNewPassword;
