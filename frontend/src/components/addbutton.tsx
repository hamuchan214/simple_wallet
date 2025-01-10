import { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TransactionDialog from './transactions/TransactionDialog';
import { createTransaction } from '../api/Transactions';
import { Snackbar, Alert } from '@mui/material';
import { emitEvent } from '../utils/useEventBus';
import { EVENT_TYPES } from '../utils/eventTypes';

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleSubmit = async (transaction: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
  }) => {
    try {
      const result = await createTransaction({
        amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
        description: transaction.description,
        date: transaction.date.toISOString(),
        tags: []
      });
      console.log(result);

      if (result.success) {
        setSnackbar({
          open: true,
          message: '取引を追加しました',
          severity: 'success'
        });
        setOpen(false);
        
        emitEvent(EVENT_TYPES.TRANSACTION_UPDATED);
      } else {
        setSnackbar({
          open: true,
          message: result.error || '取引の追加に失敗しました',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setSnackbar({
        open: true,
        message: '取引の追加に失敗しました',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      <TransactionDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}