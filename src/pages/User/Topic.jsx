import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import Input from '../../components/Input';
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder
} from '../../actions';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { Create, Delete, MoreVert } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleKeyDown } from '../../helpers';

const createFolderSchema = z.object({
  name: z.string().nonempty({ message: 'Field is required' })
});

const EditTopicModal = ({ open, onClose, topic }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: zodResolver(createFolderSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const queryClient = useQueryClient();

  const editFolderMutation = useMutation(updateFolder, {
    onSuccess: () => {
      queryClient.invalidateQueries('folders');
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const onSubmit = (data) => {
    data.user_id_id = user.id;
    data.desc = 'desc';
    data.modified_by = user.email;

    editFolderMutation.mutate({
      folderId: topic.folderId,
      payload: { ...data }
    });
    onClose();
  };

  useEffect(() => {
    setValue('name', topic?.name);
  }, [topic.name]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
    >
      <DialogTitle>Edit Module</DialogTitle>
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
        <Button onClick={handleSubmit(onSubmit)}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateTopicModal = ({ open, onClose }) => {
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
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
    >
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

const DeleteTopicModal = ({ open, onClose, topic }) => {
  const queryClient = useQueryClient();

  const deleteTopicMutation = useMutation(deleteFolder, {
    onSuccess: () => queryClient.invalidateQueries('folders'),
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = () => {
    deleteTopicMutation.mutate(topic.folderId);
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, onSubmit)}
    >
      <DialogTitle>Delete File</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Typography>Are you sure you want to delete {topic?.name}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const TopicItem = ({ name, folderId, index }) => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const images = ['/math1.jpg', '/math2.jpg', '/math3.jpg', '/math4.jpg'];

  const imageIndex = index % images.length;
  const backgroundImage = images[imageIndex];

  const navigate = useNavigate();

  return (
    <>
      <EditTopicModal
        open={edit}
        onClose={() => setEdit(false)}
        topic={{ name, folderId }}
      />
      <DeleteTopicModal
        open={open}
        onClose={() => setOpen(false)}
        topic={{ name, folderId }}
      />
      <Box sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Box
          sx={{
            height: '100px',
            backgroundImage: `url(${backgroundImage})`,
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4
          }}
        ></Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" mb={1} fontWeight="bold">
              {name}
            </Typography>
            <IconButton onClick={handleOpenMenu}>
              <MoreVert />
            </IconButton>
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            keepMounted
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => setEdit(true)}>
              <ListItemIcon>
                <Create />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpen(true);
              }}
            >
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              sx={{ color: 'white' }}
              onClick={() => navigate(folderId)}
            >
              View Material
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const Topic = () => {
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('profile'));

  const foldersQuery = useQuery('folders', getFolders, {
    select: (data) =>
      data.filter((d) => d.user_id.public_id === user?.public_id),
    enabled: !!user
  });

  return (
    <>
      <CreateTopicModal open={open} onClose={() => setOpen(false)} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ color: 'white' }}
        >
          New Module
        </Button>
      </Box>
      {foldersQuery.isLoading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2
          }}
        >
          {foldersQuery.data.map((folder, index) => (
            <TopicItem
              key={folder.public_id}
              index={index}
              folderId={folder.public_id}
              name={folder.name}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default Topic;
