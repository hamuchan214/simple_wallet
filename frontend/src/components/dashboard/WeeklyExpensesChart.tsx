import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import type { Statistics, APITransaction } from '../../model/apimodel';

interface WeeklyExpensesChartProps {
  statistics: Statistics | null;
  transactions: APITransaction[];
  loading: boolean;
}

export default function WeeklyExpensesChart({ transactions, loading }: WeeklyExpensesChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transactions?.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            週別支出
          </Typography>
          <Typography color="text.secondary">
            データがありません
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 週ごとの支出を集計
  const weeklyExpenses = new Map<string, number>();
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

  transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.amount < 0 && 
             transactionDate <= now && 
             transactionDate >= fourWeeksAgo;
    })
    .forEach(transaction => {
      const date = new Date(transaction.date);
      // 月曜日を週の始まりとして計算
      const weekStart = new Date(date);
      const day = date.getDay();
      const diff = day === 0 ? 6 : day - 1; // 日曜日は6日戻し、それ以外は月曜日まで戻す
      weekStart.setDate(date.getDate() - diff);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString().split('T')[0];
      const currentAmount = weeklyExpenses.get(weekKey) || 0;
      weeklyExpenses.set(weekKey, currentAmount + Math.abs(transaction.amount));
    });

  const data = Array.from(weeklyExpenses.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-4); // 直近4週間のみ表示

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          週別支出
        </Typography>
        <Box sx={{ width: '100%', height: isMobile ? 300 : 250 }}>
          <BarChart
            series={[
              {
                data: data.map(([_, amount]) => amount),
                label: '支出',
                valueFormatter: (value: number | null) => value ? `¥${value.toLocaleString()}` : '¥0',
                color: theme.palette.info.main,
              },
            ]}
            tooltip={{ trigger: 'axis' }}
            xAxis={[{
              data: data.map(([date]) => {
                const weekStart = new Date(date);
                const today = new Date();
                const diffTime = today.getTime() - weekStart.getTime();
                const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

                switch (diffWeeks) {
                  case 0:
                    return '今週';
                  case 1:
                    return '先週';
                  case 2:
                    return '先々週';
                  default:
                    return '3週間前';
                }
              }),
              scaleType: 'band',
            }]}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
            height={isMobile ? 300 : 250}
          />
        </Box>
      </CardContent>
    </Card>
  );
} 