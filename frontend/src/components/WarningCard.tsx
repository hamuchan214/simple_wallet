import React from 'react';
import { Card, CardContent, Typography, Button, Box, Modal } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface WarningCardProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
}

const WarningCard: React.FC<WarningCardProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  open
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      aria-labelledby="warning-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card sx={{ 
        maxWidth: 400,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" id="warning-modal-title">
              {title}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {message}
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={onCancel}>
              キャンセル
            </Button>
            <Button variant="contained" color="error" onClick={onConfirm}>
              削除
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default WarningCard;
