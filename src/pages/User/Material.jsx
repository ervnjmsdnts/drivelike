import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createModule,
  deleteModule,
  deleteQuiz,
  getFolder,
  getQuizzes,
  updateModule
} from '../../actions';
import { getModules } from '../../actions';
import { useEffect, useMemo, useState } from 'react';
import Loading from '../../components/Loading';
import {
  Add,
  ArrowBack,
  Article,
  Create,
  Delete,
  MoreVert,
  QuestionAnswer
} from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import moment from 'moment';
import Input from '../../components/Input';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleKeyDown } from '../../helpers';

const images = ['/math2.jpg', '/math3.jpg', '/math4.jpg'];

const randomIndex = Math.floor(Math.random() * images.length);
const backgroundImage = images[randomIndex];

const createModuleSchema = z.object({
  name: z.string().nonempty({ message: 'Field is required' })
});

const CreateModuleModal = ({ open, onClose, folderId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(createModuleSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const queryClient = useQueryClient();

  const createModuleMutation = useMutation(createModule, {
    onSuccess: () => {
      queryClient.invalidateQueries('modules');
      reset({ name: '' });
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const onSubmit = (data) => {
    data.folder_id_id = folderId;
    data.desc = 'desc';
    data.modified_by = user.email;

    createModuleMutation.mutate({ ...data });
    onClose();
  };
  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
    >
      <DialogTitle>New Topic</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Topic Name"
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

const EditModuleModal = ({ open, onClose, module }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: zodResolver(createModuleSchema) });

  const user = JSON.parse(localStorage.getItem('profile'));

  const queryClient = useQueryClient();

  const editModuleMutation = useMutation(updateModule, {
    onSuccess: () => {
      queryClient.invalidateQueries('modules');
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const onSubmit = (data) => {
    data.folder_id_id = module.folderId;
    data.desc = 'desc';
    data.modified_by = user.email;

    editModuleMutation.mutate({
      moduleId: module.materialId,
      payload: { ...data }
    });
    onClose();
  };

  useEffect(() => {
    setValue('name', module?.name);
  }, [module.name]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
    >
      <DialogTitle>Edit Topic</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          <Input
            size="small"
            label="Topic Name"
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

const DeleteModuleModal = ({ open, onClose, module, type }) => {
  const queryClient = useQueryClient();

  const deleteModuleMutation = useMutation(deleteModule, {
    onSuccess: () => queryClient.invalidateQueries('modules'),
    onError: () => toast.error('Something went wrong!')
  });

  const deleteQuizMutation = useMutation(deleteQuiz, {
    onSuccess: () => queryClient.invalidateQueries('quizzes'),
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = () => {
    if (type === 'MODULE') {
      deleteModuleMutation.mutate(module.materialId);
    } else {
      deleteQuizMutation.mutate(module.materialId);
    }
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
        <Typography>Are you sure you want to delete {module?.name}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const MaterialItem = ({ type, name, dateCreated, materialId, folderId }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleEdit = () => {
    if (type === 'MODULE') return setOpenEdit(true);
    return navigate(`edit-quiz/${materialId}`);
  };

  return (
    <>
      <EditModuleModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        module={{ name, materialId, folderId }}
      />
      <DeleteModuleModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        module={{ name, materialId }}
        type={type}
      />
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            ':hover': {
              bgcolor: blue[50],
              cursor: 'pointer'
            }
          }}
          onClick={() =>
            navigate(`${type === 'MODULE' ? 'module' : 'quiz'}/${materialId}`)
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {type === 'MODULE' ? <Article /> : <QuestionAnswer />}
            </Avatar>
            <Box>
              <Typography>{name}</Typography>
              <Typography variant="body2" color="gray">
                {moment(dateCreated).format('MMM DD YYYY')}
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={handleOpenMenu}
          sx={{ position: 'absolute', right: 6, top: 18, zIndex: 10 }}
        >
          <MoreVert />
        </IconButton>
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
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setOpenDelete(true)}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

const Material = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenAddNew = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddNew = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const { folderId } = useParams();
  const folderQuery = useQuery(['folder', folderId], () => getFolder(folderId));

  const mergedData = useQueries([
    {
      queryKey: 'modules',
      queryFn: getModules,
      select: (data) => data.filter((m) => m.folder_id.public_id === folderId)
    },
    {
      queryKey: 'quizzes',
      queryFn: getQuizzes,
      select: (data) => data.filter((q) => q.folder_id.public_id === folderId)
    }
  ]);

  const mergedArray = mergedData.reduce((acc, curr) => {
    if (curr.data) {
      return acc.concat(curr.data);
    }
    return acc;
  }, []);

  mergedArray.sort((a, b) => {
    const dateA = new Date(a.date_created);
    const dateB = new Date(b.date_created);
    return dateA - dateB;
  });

  const [modulesQuery, quizQuery] = mergedData;

  const isLoading = useMemo(
    () =>
      folderQuery.isLoading || modulesQuery.isLoading || quizQuery.isLoading,
    [folderQuery.isLoading, modulesQuery.isLoading, quizQuery.isLoading]
  );

  return (
    <>
      <CreateModuleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        folderId={folderQuery.data?.id}
      />
      <Container>
        {isLoading ? (
          <Loading />
        ) : (
          <Box>
            <Button
              startIcon={<ArrowBack />}
              sx={{ mb: 1, fontWeight: 'bold' }}
              size="large"
              onClick={() => navigate(-1)}
            >
              {folderQuery.data.name}
            </Button>
            <Box
              sx={{
                height: '200px',
                width: '100%',
                position: 'relative',
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 2,
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'end',
                mb: 2
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="white">
                {folderQuery.data.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                onClick={handleOpenAddNew}
                sx={{ color: 'white' }}
                variant="contained"
                startIcon={<Add />}
              >
                New
              </Button>
            </Box>
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
              <MenuItem onClick={() => setOpenModal(true)}>
                <ListItemIcon>
                  <Article />
                </ListItemIcon>
                <ListItemText>Topic</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => navigate('create-quiz')}>
                <ListItemIcon>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText>Quiz</ListItemText>
              </MenuItem>
            </Menu>
            <Stack sx={{ gap: 2 }}>
              {mergedArray.map((arr) => (
                <MaterialItem
                  key={arr.public_id}
                  name={arr.name}
                  type={arr.type}
                  dateCreated={arr.date_created}
                  materialId={arr.public_id}
                  folderId={folderQuery.data.id}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Material;
