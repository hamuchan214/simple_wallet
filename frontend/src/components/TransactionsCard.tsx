import { 
  Card, 
  CardContent, 
  CardHeader, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  Typography, 
  Divider, 
  Skeleton 
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { APITransaction } from '../model/apimodel';
import { useState } from 'react';

interface RecentTransactionsCardProps {
  transactions: APITransaction[];
  loading?: boolean;
  limit?: number;
  title?: string;
  onEdit?: (transaction: APITransaction) => void;
  onDelete?: (transaction: APITransaction) => void;
}

export default function RecentTransactionsCard({
  transactions,
  loading,
  limit = 5, 
  title = '最近の取引',
  onEdit,
  onDelete
}: RecentTransactionsCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<APITransaction | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transaction: APITransaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleEdit = () => {
    if (selectedTransaction && onEdit) {
      onEdit(selectedTransaction);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedTransaction && onDelete) {
      onDelete(selectedTransaction);
    }
    handleMenuClose();
  };

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
                    ) : (
                      <ArrowDownwardIcon color='error' />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={transaction.description}
                    secondary={new Date(transaction.date).toLocaleDateString('ja-JP')}
                  />
                  <Typography
                    variant='body1'
                    sx={{
                      color: transaction.amount > 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  >
                    ¥{transaction.amount.toLocaleString()}
                  </Typography>
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, transaction)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < displayTransactions.length - 1 && <Divider />}
              </div>
            ))
          )}
        </List>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>編集</MenuItem>
          <MenuItem onClick={handleDelete}>削除</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
} 