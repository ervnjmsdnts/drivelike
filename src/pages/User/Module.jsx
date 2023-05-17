import { Delete, FileUpload, MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteFile, getFiles, getModule, insertFile } from '../../actions';
import { useMemo, useState } from 'react';
import Loading from '../../components/Loading';
import moment from 'moment';
import { blue } from '@mui/material/colors';
import { toast } from 'react-toastify';

const DeleteFileModal = ({ open, onClose, file }) => {
  const queryClient = useQueryClient();

  const deleteFileMutation = useMutation(deleteFile, {
    onSuccess: () => queryClient.invalidateQueries('files'),
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = () => {
    deleteFileMutation.mutate(file.fileId);
    if (!deleteFileMutation.isLoading) {
      onClose();
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Delete File</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <Typography>Are you sure you want to delete {file?.name}</Typography>
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

const ModuleItem = ({ name, fileId, setSelectedFile, setOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
          ':hover': { bgcolor: blue[50], cursor: 'pointer' }
        }}
        onClick={() => navigate(fileId)}
      >
        <Typography variant="h6">{name}</Typography>
        <Typography color="gray">
          {name.split('.')[name.split('.').length - 1]}
        </Typography>
      </Box>
      <IconButton
        onClick={handleOpenMenu}
        sx={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}
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
        <MenuItem
          onClick={() => {
            setOpen(true);
            setSelectedFile({ fileId, name });
          }}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const Module = () => {
  const [open, setOpen] = useState(false);
  const { moduleId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);

  const moduleQuery = useQuery(['module', moduleId], () => getModule(moduleId));
  const filesQuery = useQuery('files', getFiles, {
    select: (data) => data.filter((f) => f.module_id.public_id === moduleId)
  });

  const isLoading = useMemo(
    () => moduleQuery.isLoading || filesQuery.isLoading,
    [moduleQuery.isLoading, filesQuery.isLoading]
  );

  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem('profile'));

  const insertFileMutation = useMutation(insertFile, {
    onSuccess: () => queryClient.invalidateQueries('files'),
    onError: () => toast.error('Something went wrong!')
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log('No File Selected');
      return;
    }
    const payload = {
      module_id_id: !moduleQuery.isLoading && moduleQuery.data?.id,
      desc: 'desc',
      modified_by: user.email,
      name: file.name,
      file: file.name
    };

    insertFileMutation.mutate({ payload, file });
  };

  return (
    <>
      <DeleteFileModal
        open={open}
        onClose={() => setOpen(false)}
        file={selectedFile}
      />
      <Container>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {moduleQuery.data.name}
              </Typography>
              <Typography variant="h5" color="gray">
                {moment(moduleQuery.data.date_created).format('MMMM DD YYYY')}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<FileUpload />}
                sx={{ color: 'white' }}
              >
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2
              }}
            >
              {filesQuery.data.map((file) => (
                <ModuleItem
                  key={file.public_id}
                  name={file.name}
                  fileId={file.public_id}
                  setSelectedFile={setSelectedFile}
                  setOpen={setOpen}
                />
              ))}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Module;
