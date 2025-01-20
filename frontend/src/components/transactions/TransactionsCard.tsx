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
import { useState, useEffect } from 'react';

//TYPE import
import { APITransaction, APITag } from '../../model/apimodel';

//component import
import TransactionDialog from './TransactionDialog';
import WarningCard from '../WarningCard';

//event bus import
import { updateTransaction, deleteTransaction } from '../../api/Transactions';
import { emitEvent } from '../../utils/useEventBus';
import { EVENT_TYPES } from '../../utils/eventTypes';
import { getTags } from '../../api/Tags';

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
  //onDelete
}: RecentTransactionsCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<APITransaction | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showWarningCard, setShowWarningCard] = useState(false);
  const [tags, setTags] = useState<APITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<APITag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const result = await getTags();
      if (result.success) {
        setTags(result.tags || []);
      }
    };
    fetchTags();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transaction: APITransaction) => {
    console.log('Opening menu for transaction:', transaction);
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  useEffect(() => {
    console.log('selectedTransaction updated:', selectedTransaction);
  }, [selectedTransaction]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (!editDialogOpen) {
      //setSelectedTransaction(null);
    }
  };

  const handleEditSubmit = async (updateData: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: Date;
    tags: APITag[];
  }) => {
    if (!selectedTransaction) return;
    try {
      console.log('updateData', updateData);
      const result = await updateTransaction(Number(selectedTransaction.id), {
        amount: updateData.type === 'income' ? Number(updateData.amount) : -Number(updateData.amount),
        description: updateData.description,
        date: updateData.date.toISOString(),
        tags: updateData.tags.map(tag => tag.name)
      });

      if(result.success) {
        emitEvent(EVENT_TYPES.TRANSACTION_UPDATED);
      }
    } catch (error) {
      console.error('取引の更新に失敗しました', error);
    } finally {
      setEditDialogOpen(false);
      setSelectedTransaction(null);
    }
  }

  const handleEdit = () => {
    if (selectedTransaction) {
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedTransaction) {
      setShowWarningCard(true);
      handleMenuClose();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) {
      console.log('selectedTransaction is null');
      return;
    }
    
    try {
      const result = await deleteTransaction(Number(selectedTransaction.id));
      
      if (result.success) {
        emitEvent(EVENT_TYPES.TRANSACTION_UPDATED);
      }
    } catch (error) {
      console.error('取引の削除に失敗しました', error);
    } finally {
      setShowWarningCard(false);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowWarningCard(false);
    setSelectedTransaction(null);
  };

  const displayTransactions = transactions.slice(0, limit);

  return (
    <>
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
      <WarningCard
        title="取引履歴の削除"
        message="この取引を削除してもよろしいですか？"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        open={showWarningCard}
      />
      
      {selectedTransaction && (
        <TransactionDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedTransaction(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={{
            type: selectedTransaction.amount > 0 ? 'income' : 'expense',
            amount: Math.abs(selectedTransaction.amount),
            description: selectedTransaction.description,
            date: new Date(selectedTransaction.date),
            tags: selectedTransaction.tags.map(tagName => ({ id: '', name: tagName }))
          }}
          mode="edit"
          tags={tags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      )}
    </>
  );
} 