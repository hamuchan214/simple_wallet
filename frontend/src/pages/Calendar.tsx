import { Container, Paper, Typography, Grid, Card, CardContent, Box, Stack, Chip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { isSameDay } from 'date-fns';
import Layout from '../layout/Layout';
import { useState, useMemo } from 'react';
import { useTransactionData } from '../lib/useTransactionData';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { Transactions, isLoading } = useTransactionData();

  const selectedDateTransactions = useMemo(() => {
    if (!Transactions || !selectedDate) return [];
    
    return Transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return isSameDay(transactionDate, selectedDate);
    });
  }, [Transactions, selectedDate]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>カレンダー</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {selectedDate ? `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日の取引` : '取引一覧'}
              </Typography>
              <Stack spacing={2}>
                {isLoading ? (
                  <Typography>読み込み中...</Typography>
                ) : selectedDateTransactions.length > 0 ? (
                  selectedDateTransactions.map((transaction) => (
                    <Card key={transaction.id}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {transaction.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                            <Typography
                              variant="h6"
                              color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                            >
                              ¥{Math.abs(transaction.amount).toLocaleString()}
                            </Typography>
                          </Box>
                          {transaction.description && (
                            <Typography variant="body2" color="text.secondary">
                              {transaction.description}
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography color="text.secondary" align="center">
                    取引がありません
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}