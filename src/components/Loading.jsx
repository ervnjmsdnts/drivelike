import { Box, CircularProgress } from '@mui/material';

const Loading = ({ height = '30vh' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height
      }}
    >
      <CircularProgress sx={{ color: 'primary.main' }} />
    </Box>
  );
};

export default Loading;
