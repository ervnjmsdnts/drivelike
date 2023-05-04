import { Box, Button } from '@mui/material';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getFile } from '../../actions';
import Loading from '../../components/Loading';
import { ArrowBack } from '@mui/icons-material';

const File = () => {
  const { fileId } = useParams();

  const fileQuery = useQuery(['file', fileId], () => getFile(fileId));

  const getUri = (file) => {
    return encodeURIComponent(
      `https://filestoragewebapi-production.up.railway.app${file}`
    );
  };

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];

  const navigate = useNavigate();

  const fileExtension =
    !fileQuery.isLoading &&
    fileQuery.data.file.substring(fileQuery.data.file.lastIndexOf('.'));

  return (
    <Box>
      {fileQuery.isLoading ? (
        <Loading />
      ) : (
        <Box>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{ py: 1, mb: 1, fontWeight: 'bold' }}
          >
            {fileQuery.data.name}
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            {imageExtensions.includes(fileExtension.toLowerCase()) ? (
              <Box
                component="img"
                sx={{ border: '1px solid black', maxWidth: '800px' }}
                src={`https://filestoragewebapi-production.up.railway.app${fileQuery.data.file}`}
              />
            ) : videoExtensions.includes(fileExtension.toLowerCase()) ? (
              <Box
                component="video"
                sx={{ maxWidth: '800px', border: '1px solid black' }}
                controls
                src={`https://filestoragewebapi-production.up.railway.app${fileQuery.data.file}`}
              />
            ) : (
              <iframe
                width="100%"
                height="1000"
                src={`https://docs.google.com/gview?url=${getUri(
                  fileQuery.data.file
                )}&embedded=true`}
              ></iframe>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default File;
