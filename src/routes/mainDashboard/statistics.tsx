import { createFileRoute } from '@tanstack/react-router';
import StatisticsDashboard from '@/features/statisticsDashboard/StatisticsDashboard';

export const Route = createFileRoute('/mainDashboard/statistics')({
  component: () => <StatisticsDashboard />,
});
