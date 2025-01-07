import React, { useState } from 'react';
import { Modal, Box, Typography, Button} from '@mui/material';
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
          そんな機能はない
        </Typography>
        <Typography variant="body2" gutterBottom>
          頑張って思い出してね
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          わかった
        </Button>
      </StyledModalBox>
    </Modal>
  );
};

export default ForgotPassword;
