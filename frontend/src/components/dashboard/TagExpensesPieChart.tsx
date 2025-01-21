import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton
} from '@mui/material';
import { Statistics } from '../../model/apimodel';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface TagExpensesPieChartProps {
  statistics: Statistics | null;
  loading: boolean;
}

const TagExpensesPieChart = ({ statistics, loading }: TagExpensesPieChartProps) => {
  const theme = useTheme();

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    '#9c27b0',
    '#795548'
  ];

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            タグ別支出（直近1ヶ月）
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton variant="circular" width={200} height={200} />
            </Box>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const tagData = statistics?.tagAmounts.filter(tag => tag.amount < 0) || [];
  const total = tagData.reduce((sum, tag) => sum + Math.abs(tag.amount), 0);

  return (
    <Card>
    </Card>
  );
};

export default TagExpensesPieChart; 