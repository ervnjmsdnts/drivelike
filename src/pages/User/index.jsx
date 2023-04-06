import { CreateNewFolder } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { useState } from 'react';
import Input from '../../components/Input';

const CreateFolderModal = ({ onClose, open }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input size="small" label="Folder Name" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const User = () => {
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  return (
    <>
      <CreateFolderModal
        open={openCreateFolder}
        onClose={() => setOpenCreateFolder(false)}
      />
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="outlined"
            onClick={() => setOpenCreateFolder(true)}
            startIcon={<CreateNewFolder />}
          >
            Create New Folder
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default User;
