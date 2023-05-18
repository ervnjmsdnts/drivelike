import { Box, Button, Typography } from '@mui/material';
import Input from '../components/Input';
import { Key } from '@mui/icons-material';
import ResetLayout from '../layouts/ResetLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { forgotPassword } from '../actions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleKeyDown } from '../helpers';

const forgotPasswordSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Field is required' })
    .email('Must be a valid email')
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation(forgotPassword, {
    onSuccess: () => {
      toast.success('Successfully sent email');
      navigate(-1);
    },
    onError: () => toast.error('Something went wrong!')
  });

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate({ ...data });
  };

  return (
    <ResetLayout>
      <Key color="primary" fontSize="large" />
      <Box textAlign="center">
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          Forgot password?
        </Typography>
        <Typography color="gray" sx={{ fontWeight: 'bold' }}>
          No Worries, we&apos;ll send you reset instructions
        </Typography>
      </Box>
      <Input
        label="Email"
        errors={errors.username}
        {...register('username')}
        onKeyDown={(e) => handleKeyDown(e, handleSubmit(onSubmit))}
      />
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit(onSubmit)}
      >
        Reset Password
      </Button>
    </ResetLayout>
  );
};

export default ForgotPassword;
