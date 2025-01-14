import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  InputAdornment,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
  }) => void;
}

export default function TransactionDialog({ open, onClose, onSubmit }: TransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());

  const handleSubmit = () => {
    if (!amount || !description || !date) return;

    onSubmit({
      type,
      amount: parseInt(amount, 10),
      description,
      date
    });

    // フォームをリセット
    setType('expense');
    setAmount('');
    setDescription('');
    setDate(new Date());
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>取引を追加</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>取引種類</InputLabel>
            <Select
              value={type}
              label="取引種類"
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            >
              <MenuItem value="income">収入</MenuItem>
              <MenuItem value="expense">支出</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">¥</InputAdornment>,
            }}
            fullWidth
          />

          <TextField
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="日付"
              value={date}
              format='yyyy/MM/dd'
              onChange={(newValue) => setDate(newValue)}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!amount || !description || !date}
        >
          追加
        </Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
} 