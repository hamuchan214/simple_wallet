import { Card, CardContent, CardHeader, List, ListItem, ListItemText, ListItemIcon, Typography, Divider } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { APITransaction } from '../../model/apimodel';

interface RecentTransactionsCardProps {
  transactions: APITransaction[];
}

export default function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  return (
    <Card>
      <CardHeader 
        title="最近の取引"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <List>
          {transactions.map((transaction, index) => (
            <div key={transaction.id}>
              <ListItem>
                <ListItemIcon>
                  {transaction.amount > 0 ? (
                    <ArrowUpwardIcon color="success" />
                  ) : (
                    <ArrowDownwardIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={transaction.description}
                  secondary={new Date(transaction.date).toLocaleDateString('ja-JP')}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: transaction.amount > 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  ¥{transaction.amount.toLocaleString()}
                </Typography>
              </ListItem>
              {index < transactions.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
} 