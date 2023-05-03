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

  const navigate = useNavigate();

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
          <iframe
            width="100%"
            height="1000"
            src={`https://docs.google.com/gview?url=${getUri(
              fileQuery.data.file
            )}&embedded=true`}
          ></iframe>
        </Box>
      )}
    </Box>
  );
};

export default File;
