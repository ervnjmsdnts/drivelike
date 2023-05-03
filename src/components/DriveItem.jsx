import { Create, Delete, MoreVert } from '@mui/icons-material';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { useState } from 'react';

const DriveItem = ({
  name,
  handleAction,
  id,
  type,
  selectedItem,
  openModal,
  setSelectedItem,
  Icon
}) => {
  const handleClick = (event) => {
    if (event.detail === 1) {
      setSelectedItem(id);
    } else if (event.detail === 2) {
      handleAction();
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenAddNew = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddNew = () => {
    setAnchorEl(null);
  };

  const isSelected = id === selectedItem;

  const color = isSelected ? blue[100] : blue[50];

  const handleEditModal = () => {
    handleCloseAddNew();
    openModal();
  };

  return (
    <Box
      sx={{
        position: 'relative'
      }}
    >
      <Box
        sx={{
          bgcolor: color,
          display: 'flex',
          gap: 1,
          cursor: 'pointer',
          alignItems: 'center',
          p: 1,
          borderRadius: 2,
          ':hover': {
            bgcolor: !isSelected && grey[200]
          }
        }}
        onClick={handleClick}
      >
        <Icon color="action" />
        <Typography
          title={name}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'black',
            maxWidth: '200px'
          }}
        >
          {name}
        </Typography>
      </Box>
      {isSelected && (
        <IconButton
          onClick={handleOpenAddNew}
          sx={{ position: 'absolute', right: 2, top: 2 }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        keepMounted
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={handleCloseAddNew}
      >
        {type === 'module' ? (
          <MenuItem onClick={handleEditModal}>
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText>Edit Folder</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleEditModal}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete File</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default DriveItem;
