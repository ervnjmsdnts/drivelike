import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createModule, getFolder, getModules } from '../../actions';
import Loading from '../../components/Loading';
import DriveItem from '../../components/DriveItem';
import { useState } from 'react';
import { Article } from '@mui/icons-material';
import Input from '../../components/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

const createModuleSchema = z.object({
  name: z.string().nonempty({ message: 'Field is required' })
});

const CreateModuleModal = ({ onClose, open, currFolderId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(createModuleSchema) });

  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem('profile'));

  const createModuleMutation = useMutation(createModule, {
    onSuccess: () => {
      queryClient.invalidateQueries('modules');
      reset({ name: '' });
    },
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = (data) => {
    data.folder_id = currFolderId;
    data.desc = 'desc';
    data.modified_by = user.email;

    createModuleMutation.mutate({ ...data });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New Module</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Module Name"
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

const Folder = () => {
  const [openCreateModule, setOpenCreateModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const { folderId } = useParams();
  const navigate = useNavigate();

  const modulesQuery = useQuery('modules', getModules, {
    select: (data) => data.filter((m) => m.folder_id.public_id === folderId)
  });

  const folderQuery = useQuery(['folder', folderId], () => getFolder(folderId));

  return (
    <>
      <CreateModuleModal
        onClose={() => setOpenCreateModule(false)}
        open={openCreateModule}
        currFolderId={!folderQuery.isLoading && folderQuery.data.id}
      />
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="outlined"
            onClick={() => setOpenCreateModule(true)}
            startIcon={<Article />}
            disabled={folderQuery.isLoading}
          >
            Create New Module
          </Button>
        </Box>
        {modulesQuery.isLoading ? (
          <Loading />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 2
            }}
          >
            {modulesQuery.data.map((module) => (
              <DriveItem
                id={module.id}
                key={module.id}
                name={module.name}
                selectedItem={selectedModule}
                setSelectedItem={setSelectedModule}
                Icon={Article}
                handleAction={() => navigate(module.public_id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Folder;
