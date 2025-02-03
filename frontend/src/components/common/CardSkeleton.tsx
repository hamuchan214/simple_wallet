import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface CardSkeletonProps {
  height?: number;
}

export default function CardSkeleton({ height = 300 }: CardSkeletonProps) {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ width: '100%', height }}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
      </CardContent>
    </Card>
  );
} 