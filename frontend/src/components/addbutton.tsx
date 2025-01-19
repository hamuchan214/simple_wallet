import { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TransactionDialog from './transactions/TransactionDialog';
import { createTransaction } from '../api/Transactions';
import { Snackbar, Alert } from '@mui/material';
import { emitEvent } from '../utils/useEventBus';
import { EVENT_TYPES } from '../utils/eventTypes';
import { getTags } from '../api/Tags';
import { APITag } from '../model/apimodel';

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<APITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<APITag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getTags();
        if (result.success) {
          setTags(result.tags || []);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);
  
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
        tags: selectedTags.map(tag => tag.name)
      });
      console.log(result);

      if (result.success) {
        setSnackbar({
          open: true,
          message: '取引を追加しました',
          severity: 'success'
        });
        setOpen(false);
        setSelectedTags([]);
        
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
        onClose={() => {
          setOpen(false);
          setSelectedTags([]);
        }}
        onSubmit={handleSubmit}
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onTagsChange={setSelectedTags}
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