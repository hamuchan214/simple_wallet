import { Card, CardContent, CardHeader, List, ListItem, ListItemText, ListItemIcon, Typography, Divider, Skeleton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { APITransaction } from '../../model/apimodel';

interface RecentTransactionsCardProps {
  transactions: APITransaction[];
  loading?: boolean;
  limit?: number;
  title?: string;
}

export default function RecentTransactionsCard({transactions,loading,limit = 5, title = '最近の取引' }: RecentTransactionsCardProps) {
    const displayTransactions = transactions.slice(0, limit);

    return (
        <Card>
        <CardHeader 
            title={title}
            titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
            <List>
                {loading ? (
                    [...Array(limit)].map((_, i) => (
                        <ListItem key={i}>
                            <Skeleton variant='rectangular' width='100%' height={50} />
                        </ListItem>
                    ))
                ) : (
                    displayTransactions.map((transaction, index) => (
                        <div key={transaction.id}>
                            <ListItem>
                                <ListItemIcon>
                                    {transaction.amount > 0 ? (
                                        <ArrowUpwardIcon color="success" />
                                    ) :(
                                        <ArrowDownwardIcon color='error' />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary = {transaction.description}
                                    secondary = {new Date(transaction.date).toLocaleDateString('ja-JP')}
                                />
                                <Typography
                                    variant='body1'
                                    sx={{
                                        color: transaction.amount > 0 ? 'success.main' : 'error.main',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ¥{transaction.amount.toLocaleString()}
                                </Typography>
                                {index < displayTransactions.length - 1 && <Divider />}
                            </ListItem>
                        </div>
                    ))
                )}
            </List>
        </CardContent>
        </Card>
    );
} 