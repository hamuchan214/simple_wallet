import { useEffect, useState } from 'react';
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
  Box,
  Autocomplete,
  Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';

import { APITag } from '../../model/apimodel';

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
    tags: APITag[];
  }) => void;
  tags: APITag[];
  selectedTags: APITag[];
  onTagsChange: (tags: APITag[]) => void;
  initialData?: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
    tags: APITag[];
  };
  mode?: 'create' | 'edit';
}

export default function TransactionDialog({ open, onClose, onSubmit, tags, selectedTags, onTagsChange, initialData, mode = 'create' }:
  TransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type ?? 'expense');
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [date, setDate] = useState<Date | null>(initialData?.date ?? new Date());

  useEffect(() => {
    if (initialData && open) {
      setType(initialData.type);
      setAmount(Math.abs(initialData.amount).toString());
      setDescription(initialData.description);
      setDate(initialData.date);
      onTagsChange(initialData.tags);
    }
  }, [initialData, open, onTagsChange]); 

  const handleSubmit = () => {
    if (!amount || !description || !date) return;

    onSubmit({
      type,
      amount: parseInt(amount, 10),
      description,
      date,
      tags: selectedTags
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
      <DialogTitle>
        {mode === 'create' ? '取引を追加' : '取引を編集'}
      </DialogTitle>
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
            error={parseInt(amount,10)<=0}
            helperText={parseInt(amount,10)<=0?"正の値を入力してください":""}
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

          <Autocomplete
            multiple
            options={tags}
            value={selectedTags}
            onChange={(_, newValue) => {
              console.log('Selected tags changed:', newValue);
              onTagsChange(newValue);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="タグ"
                placeholder="タグを選択"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    {...chipProps}
                    label={option.name}
                    onDelete={() => {
                      const newTags = selectedTags.filter((_, i) => i !== index);
                      console.log('Deleting tag, new tags:', newTags);
                      onTagsChange(newTags);
                    }}
                  />
                );
              })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!amount || parseInt(amount, 10)<=0 || !description || !date}
        >
          {mode === 'create' ? '追加' : '更新'}
        </Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
} 