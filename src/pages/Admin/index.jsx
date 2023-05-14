import { Delete, PersonAddAlt1 } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Input from '../../components/Input';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createUser, deleteUser, getAllUsers } from '../../actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Typography } from 'antd';

const createUserSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .nonempty({ message: 'Field is required' })
    .min(6, { message: 'Password must be atleast 6 characters' })
});

const CreateNewUserModal = ({ onClose, open }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(createUserSchema) });

  const queryClient = useQueryClient();

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      reset({ email: '', password: '' });
    },
    onError: (error) => {
      toast.error(error.response.data.detail[0].msg);
    }
  });

  const onSubmit = (data) => {
    data.role = 'USER';
    createUserMutation.mutate({ ...data });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New User</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box
          sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <Input
            size="small"
            label="Email"
            errors={errors.email}
            {...register('email')}
          />
          <Input
            size="small"
            label="Password"
            type="password"
            errors={errors.password}
            {...register('password')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteUserModal = ({ onClose, open, selectedUser }) => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries('users'),
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = async () => {
    deleteUserMutation.mutate(selectedUser.public_id);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Typography>Are you sure you want to delete user? </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleteUserMutation.isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={deleteUserMutation.isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Admin = () => {
  const [selectedUser, setSelectedUser] = useState({});
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);

  const allUsersQuery = useQuery('users', getAllUsers);

  const user = JSON.parse(localStorage.getItem('profile'));

  const columns = [
    {
      field: 'public_id',
      headerName: 'ID',
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      filterable: false
    },
    { field: 'email', headerName: 'Email', hideable: false, flex: 1 },
    {
      field: 'delete',
      headerName: '',
      disableColumnMenu: true,
      filterable: false,
      sortable: false,
      renderCell: (params) =>
        user.public_id !== params.row.public_id && (
          <IconButton
            onClick={() => {
              setSelectedUser(params.row);
              setOpenDeleteUser(true);
            }}
          >
            <Delete />
          </IconButton>
        )
    }
  ];

  return (
    <>
      <DeleteUserModal
        onClose={() => setOpenDeleteUser(false)}
        open={openDeleteUser}
        selectedUser={selectedUser}
      />
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
          <DataGrid
            hideFooter
            getRowId={(row) => row.public_id}
            rows={allUsersQuery.data ?? []}
            columns={columns}
            autoHeight
            loading={allUsersQuery.isLoading}
          />
        </Box>
      </Box>
    </>
  );
};

export default Admin;
