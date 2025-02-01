import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Statistics } from '../../model/apimodel';

interface ExpensesByTagPieChartProps {
  statistics: Statistics | null;
  loading: boolean;
}

export default function ExpensesByTagPieChart({ statistics, loading }: ExpensesByTagPieChartProps) {


  if (loading) {
    return <div>Loading...</div>;
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
          height: 500,  // 高さを固定
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
                innerRadius: 40,
                outerRadius: 150,
              },
            ]}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 24,
                itemMarkWidth: 10,
                itemMarkHeight: 10,
                markGap: 8,
                itemGap: 12
              },
            }}
            margin={{ 
              left: 80,
              right: 80,
              top: 20,
              bottom: 80
            }}
            width={undefined}
            height={500}
          />
        </Box>
      </CardContent>
    </Card>
  );
} 