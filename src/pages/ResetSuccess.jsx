import { Box, Button, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import ResetLayout from '../layouts/ResetLayout';
import { Link } from 'react-router-dom';

const ResetSuccess = () => {
  return (
    <ResetLayout>
      <CheckCircle color="success" fontSize="large" />
      <Box textAlign="center">
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          Password reset
        </Typography>
        <Typography color="gray" sx={{ fontWeight: 'bold' }}>
          Your password has been successfully reset.
        </Typography>
      </Box>
      <Button
        LinkComponent={Link}
        to="/"
        variant="contained"
        fullWidth
        size="large"
      >
        Back to log in
      </Button>
    </ResetLayout>
  );
};

export default ResetSuccess;
