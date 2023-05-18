import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Input from '../components/Input';
import { useMutation } from 'react-query';
import { login } from '../actions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { handleKeyDown } from '../helpers';

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
    <Box
      sx={{ display: 'flex', height: '100vh' }}
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
            <Typography fontWeight="bold" mb="16px" variant="h4">
              Login
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
                type="password"
                errors={errors.password}
                {...register('password')}
              />
              <Button
                variant="contained"
                fullWidth
                size="large"
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
        backgroundColor="primary.main"
        alignItems="center"
      >
        <Typography variant="h2" color="white" fontWeight="bold">
          Welcome to Math E-turo
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
