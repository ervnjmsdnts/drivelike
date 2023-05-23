import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({ errors, password, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(password);
  return (
    <Box width="100%">
      <TextField
        ref={ref}
        error={errors}
        helperText={errors ? errors.message : null}
        fullWidth
        type={showPassword ? 'password' : 'text'}
        InputProps={{
          endAdornment: password && (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...rest}
      />
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;
