import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import type { Statistics, APITransaction } from '../../model/apimodel';
import CardSkeleton from '../common/CardSkeleton';

interface WeeklyExpensesChartProps {
  statistics: Statistics | null;
  transactions: APITransaction[];
  loading: boolean;
}

export default function WeeklyExpensesChart({ transactions, loading }: WeeklyExpensesChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return <CardSkeleton height={isMobile ? 300 : 250} />;
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

  // トランザクションから週ごとの支出を集計
  const weeklyExpenses = new Map<string, number>();
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return t.amount < 0 && 
           transactionDate <= now && 
           transactionDate >= fourWeeksAgo;
  });

  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const weekStart = new Date(date);
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1;
    weekStart.setDate(date.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekKey = weekStart.toISOString().split('T')[0];
    const currentAmount = weeklyExpenses.get(weekKey) || 0;
    weeklyExpenses.set(weekKey, currentAmount + Math.abs(transaction.amount));
  });

  // 今週のデータが無い場合は0を追加
  const thisWeekStart = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  thisWeekStart.setDate(now.getDate() - diff);
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisWeekKey = thisWeekStart.toISOString().split('T')[0];

  if (!weeklyExpenses.has(thisWeekKey)) {
    weeklyExpenses.set(thisWeekKey, 0);
  }

  const data = Array.from(weeklyExpenses.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-4);

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
                
                // 年をまたぐ場合も正しく計算できるように修正
                const thisWeekStart = new Date(today);
                const todayDay = today.getDay();
                const todayDiff = todayDay === 0 ? 6 : todayDay - 1;
                thisWeekStart.setDate(today.getDate() - todayDiff);
                thisWeekStart.setHours(0, 0, 0, 0);

                // 週の差分を計算
                const weekDiff = Math.round(
                  (thisWeekStart.getTime() - weekStart.getTime()) / 
                  (7 * 24 * 60 * 60 * 1000)
                );

                switch (weekDiff) {
                  case 0:
                    return '今週';
                  case 1:
                    return '先週';
                  case 2:
                    return '先々週';
                  case 3:
                    return '3週間前';
                  default:
                    return `${weekDiff}週間前`;
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