import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getFile } from '../../actions';
import Loading from '../../components/Loading';

const File = () => {
  const { fileId } = useParams();

  const fileQuery = useQuery(['file', fileId], () => getFile(fileId));

  const getUri = (file) => {
    return encodeURIComponent(
      `https://filestoragewebapi-production.up.railway.app${file}`
    );
  };

  return (
    <Box>
      {fileQuery.isLoading ? (
        <Loading />
      ) : (
        <Box>
          <Typography sx={{ py: 1, fontWeight: 'bold' }}>
            {fileQuery.data.name}
          </Typography>
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
