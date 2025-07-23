
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { CulturalLoading } from '@/components/ui/CulturalLoadingStates';
import { Activity, Clock, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const PerformanceMetrics: React.FC = () => {
  const { metrics, isLoading, getMetricStatus } = usePerformanceMonitor();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <CulturalLoading variant="pattern" message="Analyzing performance..." />
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Performance data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(2)}s`;
  const formatMemory = (mb: number) => `${mb.toFixed(1)} MB`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'needs-improvement':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const metricsData = [
    {
      icon: Clock,
      label: 'First Contentful Paint',
      value: formatTime(metrics.firstContentfulPaint),
      status: getMetricStatus('firstContentfulPaint', metrics.firstContentfulPaint),
      threshold: '1.5s'
    },
    {
      icon: TrendingUp,
      label: 'Largest Contentful Paint',
      value: formatTime(metrics.largestContentfulPaint),
      status: getMetricStatus('largestContentfulPaint', metrics.largestContentfulPaint),
      threshold: '2.5s'
    },
    {
      icon: Zap,
      label: 'Time to Interactive',
      value: formatTime(metrics.timeToInteractive),
      status: getMetricStatus('timeToInteractive', metrics.timeToInteractive),
      threshold: '3.5s'
    },
    {
      icon: Activity,
      label: 'Cumulative Layout Shift',
      value: metrics.cumulativeLayoutShift.toFixed(3),
      status: getMetricStatus('cumulativeLayoutShift', metrics.cumulativeLayoutShift),
      threshold: '0.1'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-saffron" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-saffron" />
                <div>
                  <p className="font-medium text-sm">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">Target: {metric.threshold}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{metric.value}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-white",
                    getStatusColor(metric.status)
                  )}
                >
                  {metric.status === 'good' ? 'Good' : 
                   metric.status === 'needs-improvement' ? 'Fair' : 'Poor'}
                </Badge>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Memory Usage</span>
            <span className="text-sm font-mono">{formatMemory(metrics.memoryUsage)}</span>
          </div>
          <Progress 
            value={Math.min((metrics.memoryUsage / 100) * 100, 100)} 
            className="mt-2"
          />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-medium">Total Load Time</span>
          <span className="text-sm font-mono">{formatTime(metrics.totalLoadTime)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
