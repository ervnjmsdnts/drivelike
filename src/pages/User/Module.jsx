import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getFiles, getModule, insertFile } from '../../actions';
import { toast } from 'react-toastify';
import { Article, UploadFile } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import DriveItem from '../../components/DriveItem';

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

const Module = () => {
  const [openInsertFileModal, setOpenInsertFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { moduleId } = useParams();
  const navigate = useNavigate();

  const filesQuery = useQuery('files', getFiles, {
    select: (data) => data.filter((t) => t.module_id.public_id === moduleId)
  });

  const moduleQuery = useQuery(['module', moduleId], () => getModule(moduleId));

  return (
    <>
      <InsertFileModal
        open={openInsertFileModal}
        onClose={() => setOpenInsertFileModal(false)}
        moduleId={!moduleQuery.isLoading && moduleQuery.data.id}
      />
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={() => setOpenInsertFileModal(true)}
            startIcon={<UploadFile />}
            variant="outlined"
          >
            Upload New File
          </Button>
        </Box>

        {filesQuery.isLoading ? (
          <Loading />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 2
            }}
          >
            {filesQuery.data.map((file) => (
              <DriveItem
                id={file.id}
                key={file.id}
                name={file.name}
                selectedItem={selectedFile}
                setSelectedItem={setSelectedFile}
                Icon={Article}
                handleAction={() => navigate(file.public_id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Module;
