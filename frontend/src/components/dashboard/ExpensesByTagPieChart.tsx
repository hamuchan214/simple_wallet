import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Statistics } from '../../model/apimodel';
import CardSkeleton from '../common/CardSkeleton';

interface ExpensesByTagPieChartProps {
  statistics: Statistics | null;
  loading: boolean;
}

export default function ExpensesByTagPieChart({ statistics, loading }: ExpensesByTagPieChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return <CardSkeleton height={isMobile ? 400 : 500} />;
  }

  if (!statistics?.tagAmounts?.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            タグ別支出
          </Typography>
          <Typography color="text.secondary">
            データがありません
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const data = statistics.tagAmounts
    .filter(tag => tag.amount < 0) // 支出のみを表示
    .map(tag => ({
      id: tag.name,
      value: Math.abs(tag.amount),
      label: tag.name,
    }))
    .sort((a, b) => b.value - a.value); // 金額の大きい順にソート


  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          タグ別支出（直近30日）
        </Typography>
        <Box sx={{ 
          width: '100%', 
          height: isMobile ? 400 : 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <PieChart
            series={[
              {
                data,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30 },
                arcLabel: (item) => `¥${item.value.toLocaleString()}`,
                arcLabelMinAngle: 45,
                innerRadius: isMobile ? 30 : 40,
                outerRadius: isMobile ? 120 : 150,
              },
            ]}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: isMobile ? 16 : 24,
                itemMarkWidth: 10,
                itemMarkHeight: 10,
                markGap: 8,
                itemGap: isMobile ? 8 : 12
              },
            }}
            margin={{ 
              left: isMobile ? 40 : 80,
              right: isMobile ? 40 : 80,
              top: 20,
              bottom: isMobile ? 60 : 80
            }}
            width={undefined}
            height={isMobile ? 400 : 500}
          />
        </Box>
      </CardContent>
    </Card>
  );
} 