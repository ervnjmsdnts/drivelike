import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const ResetLayout = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 12
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {children}
          {!pathname.includes('reset-success') && (
            <Button LinkComponent={Link} to="/">
              <ArrowBack sx={{ mr: '8px' }} />
              <Typography>Back to log in</Typography>
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ResetLayout;
