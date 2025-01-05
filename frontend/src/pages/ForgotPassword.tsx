import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button} from '@mui/material';
import { styled } from '@mui/system';

const StyledModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: theme.spacing(2),
}));


interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, handleClose }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('Password reset requested for:', email);
    // パスワードリセット処理をここに実装
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledModalBox>
        <Typography variant="h6" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body2" gutterBottom>
          Enter your email address, and we’ll send you instructions to reset your password.
        </Typography>
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Send Reset Link
        </Button>
      </StyledModalBox>
    </Modal>
  );
};

export default ForgotPassword;
