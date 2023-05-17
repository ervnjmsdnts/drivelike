import {
  Add,
  ArrowBack,
  Article,
  Create,
  CreateNewFolder,
  Folder,
  UploadFile
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Input from '../../components/Input';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createFolder,
  createModule,
  deleteFile,
  getFiles,
  getFolders,
  getModules,
  insertFile,
  updateModule
} from '../../actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import DriveItem from '../../components/DriveItem';
import { useNavigate } from 'react-router-dom';

const createModuleSchema = z.object({
  name: z.string().nonempty({ message: 'Field is required' })
});

const CreateModuleModal = ({
  onClose,
  open,
  currFolderId,
  editModule,
  modules,
  selectedModule
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({ resolver: zodResolver(createModuleSchema) });

  const handleClose = () => {
    onClose();
    reset({ name: '' });
  };

  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem('profile'));

  const module = modules?.find((m) => m.public_id === selectedModule);

  const createModuleMutation = useMutation(createModule, {
    onSuccess: () => {
      queryClient.invalidateQueries('modules');
      reset({ name: '' });
    },
    onError: () => toast.error('Something went wrong!')
  });

  useEffect(() => {
    if (editModule) {
      setValue('name', module?.name);
    } else {
      setValue('name', '');
    }
  }, [editModule]);

  const updateModuleMutation = useMutation(updateModule, {
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

    if (editModule) {
      updateModuleMutation.mutate({
        moduleId: selectedModule,
        payload: { ...data }
      });
    } else {
      createModuleMutation.mutate({ ...data });
    }
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{editModule ? 'Edit' : 'New'} Folder</DialogTitle>
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
        <Button onClick={handleSubmit(onSubmit)}>
          {editModule ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

const DeleteFileModal = ({ onClose, open, selectedFile, files }) => {
  const queryClient = useQueryClient();

  const file = files?.find((f) => f.public_id === selectedFile);

  const deleteFileMutation = useMutation(deleteFile, {
    onSuccess: () => queryClient.invalidateQueries('files'),
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = async () => {
    deleteFileMutation.mutate(selectedFile);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Delete File</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Typography>Are you sure you want to delete? {file?.name}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleteFileMutation.isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={deleteFileMutation.isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const InsertFileModal = ({ onClose, open, moduleId }) => {
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem('profile'));

  const insertFileMutation = useMutation(insertFile, {
    onSuccess: () => queryClient.invalidateQueries('files'),
    onError: () => toast.error('Something went wrong!')
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = () => {
    if (!file) {
      console.log('No File Selected');
      return;
    }
    const payload = {
      module_id: moduleId,
      desc: 'desc',
      modified_by: user.email,
      name: file.name,
      file: file.name
    };

    insertFileMutation.mutate({ payload, file });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>New File</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ pt: 1 }}>
          {!!file && <Typography>{file.name}</Typography>}
          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

const User = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [highlightedModule, setHighlightedModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [openCreateModule, setOpenCreateModule] = useState(false);
  const [openInsertFileModal, setOpenInsertFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [editModule, setEditModule] = useState(false);
  const [deleteFile, setDeleteFile] = useState(false);

  const open = Boolean(anchorEl);
  const handleOpenAddNew = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddNew = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();

  const user = JSON.parse(localStorage.getItem('profile'));

  const foldersQuery = useQuery('folders', getFolders, {
    select: (data) =>
      data.filter((d) => d.user_id.public_id === user?.public_id),
    enabled: !!user,
    onSuccess: (data) => setSelectedFolder(data[0])
  });

  const modulesQuery = useQuery('modules', getModules, {
    select: (data) =>
      data.filter((m) => m.folder_id.public_id === selectedFolder?.public_id),
    enabled: !!selectedFolder
  });

  const filesQuery = useQuery('files', getFiles, {
    select: (data) =>
      data.filter((t) => t.module_id.public_id === selectedModule?.public_id),
    enabled: !!selectedModule
  });

  const isLoading = useMemo(
    () => foldersQuery.isLoading || modulesQuery.isLoading,
    [foldersQuery.isLoading, modulesQuery.isLoading]
  );

  const navigate = useNavigate();

  return (
    <>
      <DeleteFileModal
        files={filesQuery?.data}
        selectedFile={selectedFile}
        open={deleteFile}
        onClose={() => setDeleteFile(false)}
      />
      <CreateFolderModal
        open={openCreateFolder}
        onClose={() => setOpenCreateFolder(false)}
      />
      <CreateModuleModal
        onClose={() => {
          setOpenCreateModule(false);
          setEditModule(false);
        }}
        open={openCreateModule}
        editModule={editModule}
        modules={modulesQuery?.data}
        selectedModule={highlightedModule}
        currFolderId={!isLoading && selectedFolder?.id}
      />
      <InsertFileModal
        open={openInsertFileModal}
        onClose={() => setOpenInsertFileModal(false)}
        moduleId={!isLoading && selectedModule?.id}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: 48, fontWeight: 'bold' }}>
            Hello
          </Typography>
        </Stack>
        <Box
          bgcolor={theme.palette.primary.main}
          sx={{
            flexGrow: 1,
            boxShadow: 4,
            p: 4,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            color: 'white'
          }}
        >
          <Typography
            sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 32 }}
          >
            MATERIALS
          </Typography>
          {isLoading ? (
            <Loading />
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    flexGrow: 1,
                    overflowX: 'auto'
                  }}
                >
                  {foldersQuery?.data?.map((folder) => (
                    <Button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder)}
                      variant="text"
                      disabled={!!selectedModule}
                      sx={{ color: 'white', fontSize: 16 }}
                    >
                      {folder.name}
                      {selectedFolder?.public_id === folder?.public_id && (
                        <Box
                          sx={{
                            width: '100%',
                            height: 2,
                            bgcolor: 'white',
                            position: 'absolute',
                            bottom: 0
                          }}
                        />
                      )}
                    </Button>
                  ))}
                </Box>
                <Button
                  onClick={handleOpenAddNew}
                  variant="contained"
                  color="info"
                  startIcon={<Add />}
                >
                  New
                </Button>
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
                  {selectedModule ? (
                    <MenuItem onClick={() => setOpenInsertFileModal(true)}>
                      <ListItemIcon>
                        <UploadFile />
                      </ListItemIcon>
                      <ListItemText>Upload File</ListItemText>
                    </MenuItem>
                  ) : (
                    <Box>
                      <MenuItem onClick={() => setOpenCreateFolder(true)}>
                        <ListItemIcon>
                          <Create />
                        </ListItemIcon>
                        <ListItemText>New Topic</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => setOpenCreateModule(true)}>
                        <ListItemIcon>
                          <CreateNewFolder />
                        </ListItemIcon>
                        <ListItemText>New Folder</ListItemText>
                      </MenuItem>
                    </Box>
                  )}
                </Menu>
              </Box>
              {selectedModule ? (
                <Box mt={2}>
                  <Button
                    onClick={() => setSelectedModule(null)}
                    sx={{ color: 'white', fontSize: 16 }}
                    startIcon={<ArrowBack sx={{ color: 'white' }} />}
                  >
                    {selectedModule.name}
                  </Button>
                  {filesQuery.isLoading ? (
                    <Loading />
                  ) : (
                    <Box
                      sx={{
                        mt: 2,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: 2
                      }}
                    >
                      {filesQuery.data.map((file) => (
                        <DriveItem
                          id={file.public_id}
                          key={file.id}
                          name={file.name}
                          selectedItem={selectedFile}
                          setSelectedItem={setSelectedFile}
                          type="file"
                          openModal={() => setDeleteFile(true)}
                          Icon={Article}
                          handleAction={() => navigate(file.public_id)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    mt: 2,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 2
                  }}
                >
                  {modulesQuery?.data?.map((module) => (
                    <DriveItem
                      id={module.public_id}
                      key={module.id}
                      name={module.name}
                      selectedItem={highlightedModule}
                      setSelectedItem={setHighlightedModule}
                      openModal={() => {
                        setOpenCreateModule(true);
                        setEditModule(true);
                      }}
                      type="module"
                      Icon={Folder}
                      handleAction={() => setSelectedModule(module)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default User;
