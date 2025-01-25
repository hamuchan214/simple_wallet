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

  const upcomingTransactions = transactions
    .filter(t => new Date(t.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!upcomingTransactions.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            今後の支払い
          </Typography>
          <Typography color="text.secondary">
            予定されている支払いはありません
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          今後の支払い
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
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                    <Typography 
                      variant="h6"
                      color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                    >
                      ¥{Math.abs(transaction.amount).toLocaleString()}
                    </Typography>
                  </Stack>
                  {transaction.description && (
                    <Typography color="text.secondary">
                      {transaction.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1}>
                    {transaction.tags.map((tag) => (
                      <Chip 
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
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