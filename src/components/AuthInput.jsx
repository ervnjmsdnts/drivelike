import { Box, TextField } from '@mui/material';
import { forwardRef } from 'react';

const AuthInput = forwardRef(({ errors, ...rest }, ref) => {
  return (
    <Box width="100%">
      <TextField
        ref={ref}
        error={errors}
        helperText={errors ? errors.message : null}
        fullWidth
        {...rest}
      />
    </Box>
  );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;
