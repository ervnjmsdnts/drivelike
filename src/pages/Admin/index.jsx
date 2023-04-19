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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createUser, getAllUsers } from '../../actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

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

const columns = [
  {
    field: 'public_id',
    headerName: 'ID',
    flex: 1,
    disableColumnMenu: true,
    sortable: false
  },
  { field: 'email', headerName: 'Email', flex: 1 }
];

const Admin = () => {
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const allUsersQuery = useQuery('users', getAllUsers);

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
