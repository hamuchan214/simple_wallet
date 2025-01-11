import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  loading?: boolean;
}

export default function SummaryCard({ title, amount, type }: SummaryCardProps) {
  const getColor = () => {
    switch (type) {
      case 'income':
        return 'success.main';
      case 'expense':
        return 'error.main';
      default:
        return 'primary.main';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'expense':
        return <TrendingDownIcon sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getIcon()}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            color: getColor(),
            fontWeight: 'bold' 
          }}
        >
          ¥{amount.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
} 