import { Box, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';

const DriveItem = ({
  name,
  handleAction,
  id,
  selectedFolder,
  setSelectedFolder,
  Icon
}) => {
  const handleClick = (event) => {
    if (event.detail === 1) {
      setSelectedFolder(id);
    } else if (event.detail === 2) {
      handleAction();
    }
  };

  const isSelected = id === selectedFolder;

  const color = isSelected ? blue[100] : blue[50];

  return (
    <Box
      sx={{
        bgcolor: color,
        display: 'flex',
        gap: 1,
        cursor: 'pointer',
        alignItems: 'center',
        px: 1,
        py: 1.5,
        borderRadius: 2,
        ':hover': {
          bgcolor: !isSelected && grey[200]
        }
      }}
      onClick={handleClick}
    >
      <Icon color="action" />
      <Typography>{name}</Typography>
    </Box>
  );
};

export default DriveItem;
