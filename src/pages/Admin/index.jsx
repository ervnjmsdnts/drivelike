import { PersonAddAlt1 } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Input from '../../components/Input';
import { useState } from 'react';
import moment from 'moment';

const CreateNewUserModal = ({ onClose, open }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New User</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box
          sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <Input size="small" label="Email" />
          <Input size="small" label="Password" type="password" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const rows = [
  {
    id: 1,
    email: 'Hello@gmail.com',
    createdAt: moment().format('MMMM DD, YYYY hh:mm A')
  },
  {
    id: 2,
    email: 'DataGridPro@email.com',
    createdAt: moment().format('MMMM DD, YYYY hh:mm A')
  },
  {
    id: 3,
    email: 'MUI@thanks.com',
    createdAt: moment().format('MMMM DD, YYYY hh:mm A')
  }
];

const columns = [
  { field: 'id', headerName: 'ID', width: 240 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 }
];

const Admin = () => {
  const [openCreateUser, setOpenCreateUser] = useState(false);

  return (
    <>
      <CreateNewUserModal
        onClose={() => setOpenCreateUser(false)}
        open={openCreateUser}
      />
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="outlined"
            startIcon={<PersonAddAlt1 />}
            onClick={() => setOpenCreateUser(true)}
          >
            Create New User
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <DataGrid hideFooter rows={rows} columns={columns} autoHeight />
        </Box>
      </Box>
    </>
  );
};

export default Admin;
