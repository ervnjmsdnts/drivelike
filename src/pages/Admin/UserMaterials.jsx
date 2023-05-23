import {
  Avatar,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { useQuery } from 'react-query';
import { getFiles } from '../../actions';
import Loading from '../../components/Loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';

const ModuleItem = ({ name, fileId }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
          height: '100%',
          ':hover': { bgcolor: blue[50], cursor: 'pointer' }
        }}
        onClick={() => navigate(fileId)}
      >
        <Typography variant="h6">{name}</Typography>
        <Typography color="gray">
          {name.split('.')[name.split('.').length - 1]}
        </Typography>
      </Box>
    </Box>
  );
};

const UserMaterials = () => {
  const filesQuery = useQuery('files', getFiles);
  const [filterEmail, setFilterEmail] = useState('all');

  const [searchparams] = useSearchParams();

  useEffect(() => {
    if (searchparams.get('email')) {
      setFilterEmail(searchparams.get('email'));
    }
  }, [searchparams.get('email')]);

  const uniqueEmailsAndFiles = {};
  if (filesQuery.isSuccess) {
    filesQuery.data.forEach((file) => {
      const email = file.module_id.folder_id.user_id.email;
      if (!uniqueEmailsAndFiles[email]) {
        uniqueEmailsAndFiles[email] = [];
      }
      uniqueEmailsAndFiles[email].push(file);
    });
  }
  const uniqueEmails = Object.keys(uniqueEmailsAndFiles);

  const filteredEmails =
    filterEmail === 'all'
      ? uniqueEmails.filter((email) => email.includes(''))
      : uniqueEmails.filter((email) => email.includes(filterEmail));

  return (
    <Container sx={{ pb: 2 }}>
      {filesQuery.isLoading ? (
        <Loading />
      ) : (
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="select">Filter</InputLabel>
            <Select
              labelId="select"
              id="select"
              label="Filter"
              defaultValue="all"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            >
              <MenuItem value="all" key="all">
                All
              </MenuItem>
              {uniqueEmails.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {filteredEmails.map((email) => (
            <Box key={email} mb={4}>
              <Box
                sx={{ display: 'flex', mb: 2, alignItems: 'center', gap: 2 }}
              >
                <Avatar />
                <Typography variant="h6" fontWeight="bold">
                  {email}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2
                }}
              >
                {uniqueEmailsAndFiles[email].map((file) => (
                  <ModuleItem
                    name={file.name}
                    fileId={file.public_id}
                    key={file.public_id}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default UserMaterials;
