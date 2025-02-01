import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Statistics } from '../../model/apimodel';

interface ExpensesByTagPieChartProps {
  statistics: Statistics | null;
  loading: boolean;
}

export default function ExpensesByTagPieChart({ statistics, loading }: ExpensesByTagPieChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // データ量が多い場合は下部にレジェンドを配置
  const shouldUseLowerLegend = data.length > 5 || isMobile;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          タグ別支出（直近30日）
        </Typography>
        <Box sx={{ width: '100%', height: shouldUseLowerLegend ? 500 : 400 }}>
          <PieChart
            series={[
              {
                data,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30 },
                arcLabel: (item) => `¥${item.value.toLocaleString()}`,  // 金額を表示
                arcLabelMinAngle: 45,  // ラベルを表示する最小角度
                innerRadius: 40,  // 内側の半径を大きく
                outerRadius: shouldUseLowerLegend ? 150 : 130,  // 外側の半径を大きく
              },
            ]}
            slotProps={{
              legend: {
                direction: shouldUseLowerLegend ? 'row' : 'column',
                position: shouldUseLowerLegend
                  ? { vertical: 'bottom', horizontal: 'middle' }
                  : { vertical: 'middle', horizontal: 'right' },
                padding: 12,  // パディングも少し大きく
                itemMarkWidth: 10,  // マーカーも少し大きく
                itemMarkHeight: 10,
                markGap: 8,
              },
            }}
            width={undefined}
            height={shouldUseLowerLegend ? 500 : 400}  // 全体の高さも大きく
          />
        </Box>
      </CardContent>
    </Card>
  );
} 