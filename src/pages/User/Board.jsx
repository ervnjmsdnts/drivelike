import { Box } from '@mui/material';
import DrawingBoard from 'react-drawing-board';

const Board = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ maxWidth: '800px', textAlign: 'center' }}>
        <DrawingBoard toolbarPlacement="left" />
      </Box>
    </Box>
  );
};

export default Board;
