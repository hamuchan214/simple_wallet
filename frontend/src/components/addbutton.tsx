import { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TransactionDialog from './transactions/TransactionDialog';

export default function AddButton() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (transaction: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
  }) => {
    try {
      // TODO: APIを呼び出して取引を保存
      console.log('New transaction:', transaction);
    } catch (error) {
      console.error('Failed to add transaction:', error);
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
    </>
  );
}