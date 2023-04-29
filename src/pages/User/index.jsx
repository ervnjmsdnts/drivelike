import { CreateNewFolder, Folder } from '@mui/icons-material';
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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createFolder, getFolders } from '../../actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import DriveItem from '../../components/DriveItem';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const createFolderSchema = z.object({
  name: z.string().nonempty({ message: 'Field is required' })
});

const CreateFolderModal = ({ onClose, open }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(createFolderSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const queryClient = useQueryClient();

  const createFolderMutation = useMutation(createFolder, {
    onSuccess: () => {
      queryClient.invalidateQueries('folders');
      reset({ name: '' });
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const onSubmit = (data) => {
    data.user_id_id = user.id;
    data.desc = 'desc';
    data.modified_by = user.email;

    createFolderMutation.mutate({ ...data });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Folder Name"
            {...register('name')}
            errors={errors.name}
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

const User = () => {
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('profile'));

  const foldersQuery = useQuery('folders', getFolders, {
    select: (data) =>
      data.filter((d) => d.user_id.public_id === user.public_id),
    enabled: !!user
  });

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
        {foldersQuery.isLoading ? (
          <Loading />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 2
            }}
          >
            {foldersQuery.data.map((folder) => (
              <DriveItem
                name={folder.name}
                selectedItem={selectedFolder}
                setSelectedItem={setSelectedFolder}
                id={folder.id}
                Icon={Folder}
                handleAction={() => navigate(folder.public_id)}
                key={folder.id}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default User;
