import { Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import type { Statistics } from '../../model/apimodel';

interface MonthlyStatisticsProps {
  statistics: Statistics | null;
  isLoading: boolean;
}

export default function MonthlyStatistics({ statistics, isLoading }: MonthlyStatisticsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={4} key={item}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={40} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          今月の収支
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" color="text.secondary">
              収入
            </Typography>
            <Typography variant="h5" color="success.main">
              ¥{statistics?.totalIncome.toLocaleString() ?? 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" color="text.secondary">
              支出
            </Typography>
            <Typography variant="h5" color="error.main">
              ¥{statistics?.totalExpense.toLocaleString() ?? 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" color="text.secondary">
              収支
            </Typography>
            <Typography 
              variant="h5" 
              color={statistics?.balance && statistics.balance > 0 ? 'success.main' : 'error.main'}
            >
              ¥{statistics?.balance.toLocaleString() ?? 0}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 