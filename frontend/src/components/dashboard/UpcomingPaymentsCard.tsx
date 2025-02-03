import { Card, CardContent, Typography, Box, List, ListItem, Stack, Chip } from '@mui/material';
import type { APITransaction } from '../../model/apimodel';

interface UpcomingPaymentsCardProps {
  transactions: APITransaction[];
  loading: boolean;
}

export default function UpcomingPaymentsCard({ transactions, loading }: UpcomingPaymentsCardProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const upcomingTransactions = transactions
    .filter(t => new Date(t.date) >= tomorrow)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!upcomingTransactions.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            今後の支払い・収入
          </Typography>
          <Typography color="text.secondary">
            予定されている支払い・収入はありません
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          今後の支払い・収入
        </Typography>
        <List>
          {upcomingTransactions.map((transaction) => (
            <ListItem 
              key={transaction.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 2,
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    {transaction.tags.map((tag) => (
                      <Chip 
                        key={tag}
                        label={tag}
                        size="medium"
                        variant="outlined"
                        sx={{
                          borderWidth: 2,
                          fontSize: '0.9rem'
                        }}
                      />
                    ))}
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                      {transaction.description && (
                        <Typography variant="body1" color="text.secondary">
                          {transaction.description}
                        </Typography>
                      )}
                    </Stack>
                    <Typography 
                      variant="h6"
                      color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                    >
                      ¥{Math.abs(transaction.amount).toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
} 