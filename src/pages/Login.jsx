import { Box, Button, Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Input from '../components/Input';
import { useMutation } from 'react-query';
import { login } from '../actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { handleKeyDown } from '../helpers';
import MainLogin from '/mainlogin.jpg';
import About from './User/About';

const trivias = [
  {
    desc: 'The word “hundred” comes from the old Norse term, “hundrath”, which actually means 120 and not 100.',
    image: '/trivia1.jpg'
  },
  {
    desc: '“Forty” is the only number that is spelt with letters arranged in alphabetical order.',
    image: '/trivia2.jpg'
  },
  {
    desc: 'Four’ is the only number in the English language that is spelt with the same number of letters as the number itself.',
    image: '/trivia3.jpg'
  },
  {
    desc: 'From 0 to 1000, the only number that has the letter “a” in it is “one thousand”.',
    image: '/trivia4.jpg'
  }
];

const loginSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .nonempty({ message: 'Field is required' })
    .min(6, { message: 'Password must be atleast 6 characters' })
});

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      const { access, user } = data;
      localStorage.setItem('token', access);
      localStorage.setItem('profile', JSON.stringify(user));

      if (user.role === 'USER') {
        window.location.href = '/user';
      }
      if (user.role === 'ADMIN') {
        window.location.href = '/admin';
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate({ ...data });
  };

  return (
    <Box>
      <Box
        sx={{ display: 'flex', height: '95vh' }}
        onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
      >
        <Box
          sx={{
            display: 'flex',
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              marginX: '16px',
              borderRadius: '16px',
              padding: '16px'
            }}
          >
            <Stack gap="8px" width="100%">
              <Typography
                fontWeight="bold"
                textAlign="center"
                mb="16px"
                variant="h4"
              >
                Welcome to Math e-Turo
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap="16px"
              >
                <Input
                  label="Email"
                  errors={errors.username}
                  {...register('username', { required: true })}
                />
                <Input
                  label="Password"
                  password
                  errors={errors.password}
                  {...register('password')}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ color: 'white' }}
                  onClick={handleSubmit(onSubmit)}
                >
                  Login
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Link
                  component={RouterLink}
                  underline="none"
                  to="forgot-password"
                >
                  Forgot your password?
                </Link>
              </Box>
            </Stack>
          </Box>
        </Box>
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            component="img"
            src={MainLogin}
            alt="MainLogin"
            sx={{ width: 1000 }}
          />
        </Box>
      </Box>
      <Container sx={{ pb: 2 }}>
        {trivias.map((trivia, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            {index % 2 === 0 ? (
              <>
                <Typography maxWidth="500px" variant="h6">
                  {trivia.desc}
                </Typography>
                <Box
                  component="img"
                  sx={{ borderRadius: 2, width: '400px' }}
                  src={trivia.image}
                  alt={trivia.image}
                />
              </>
            ) : (
              <>
                <Box
                  component="img"
                  sx={{ borderRadius: 2, width: '400px' }}
                  src={trivia.image}
                  alt={trivia.image}
                />
                <Typography maxWidth="500px" variant="h6">
                  {trivia.desc}
                </Typography>
              </>
            )}
          </Box>
        ))}
        <About />
      </Container>
    </Box>
  );
};

export default Login;
