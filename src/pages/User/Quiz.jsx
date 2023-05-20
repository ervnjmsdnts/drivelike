import { Box, Container, Radio, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../../actions';
import Loading from '../../components/Loading';

const Question = ({ text, index, type, options, correct_option }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        p: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography fontWeight="bold">
          {index + 1}. {text}
        </Typography>
      </Box>
      {(type === 'MULTIPLE' || options?.length) && (
        <Box>
          {options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Radio checked={index === correct_option} />
              <Typography>{option}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const Quiz = () => {
  const { quizId } = useParams();

  const quizQuery = useQuery(['quiz', quizId], () => getQuiz(quizId));

  console.log(quizQuery.data);

  return (
    <Container maxWidth="xl">
      {quizQuery.isLoading ? (
        <Loading />
      ) : (
        <>
          <Stack gap={2}>
            <Typography variant="h6">
              <strong>Title:</strong> {quizQuery.data?.name}
            </Typography>
            <Typography variant="h6">
              <strong>Instructions:</strong> {quizQuery.data?.desc}
            </Typography>
          </Stack>
          <Stack gap={2} sx={{ overflow: 'auto', minHeight: '600px', py: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Questions
            </Typography>
            {quizQuery.data?.questions.map((q, index) => (
              <Question key={index} {...q} index={index} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Quiz;
