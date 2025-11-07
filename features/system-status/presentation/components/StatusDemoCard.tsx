import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSystemStatus } from '@/features/system-status';
import { SystemStatus } from '@/features/system-status';

const StatusDemoCard: React.FC = () => {
  const { state, actions } = useSystemStatus();

  const demoStatuses: { status: SystemStatus; label: string; description: string }[] = [
    {
      status: 'operational',
      label: 'Operational',
      description: 'All systems running normally'
    },
    {
      status: 'maintenance',
      label: 'Maintenance',
      description: 'Scheduled maintenance in progress'
    },
    {
      status: 'degraded',
      label: 'Degraded',
      description: 'Some services experiencing issues'
    },
    {
      status: 'outage',
      label: 'Outage',
      description: 'Critical system outage'
    }
  ];

  const triggerStatus = (status: SystemStatus) => {
    let message;
    switch (status) {
      case 'operational':
        actions.updateStatus('operational');
        break;
      case 'maintenance':
        message = {
          title: 'Scheduled Maintenance',
          message: 'System maintenance is scheduled for tonight from 2-4 AM EST. Some features may be temporarily unavailable.',
          status: 'maintenance' as const,
          severity: 'info' as const,
          estimatedResolution: new Date(Date.now() + 4 * 60 * 60 * 1000),
          affectedServices: ['API', 'Dashboard', 'Analytics'],
          isDismissible: true,
          linkToStatusPage: '/system-health',
        };
        actions.updateStatus('maintenance', message);
        break;
      case 'degraded':
        message = {
          title: 'Service Degradation',
          message: 'File upload services are experiencing delays. Other features remain operational.',
          status: 'degraded' as const,
          severity: 'warning' as const,
          affectedServices: ['File Storage'],
          isDismissible: true,
          linkToStatusPage: '/system-health',
        };
        actions.updateStatus('degraded', message);
        break;
      case 'outage':
        message = {
          title: 'System Outage',
          message: 'Critical system outage detected. Our team is working to resolve this issue.',
          status: 'outage' as const,
          severity: 'critical' as const,
          affectedServices: ['API', 'Authentication', 'Database'],
          isDismissible: false,
          linkToStatusPage: '/system-health',
        };
        actions.updateStatus('outage', message);
        break;
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">System Status Demo</CardTitle>
        <CardDescription className="text-gray-400">
          Test different system status scenarios to see the banner in action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Current Status:</span>
            <Badge
              className={`${
                state.currentStatus === 'operational'
                  ? 'bg-green-600'
                  : state.currentStatus === 'degraded'
                  ? 'bg-yellow-600'
                  : state.currentStatus === 'maintenance'
                  ? 'bg-blue-600'
                  : 'bg-red-600'
              } text-white`}
            >
              {state.currentStatus.charAt(0).toUpperCase() + state.currentStatus.slice(1)}
            </Badge>
          </div>

          {/* Status Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {demoStatuses.map(({ status, label, description }) => (
              <Button
                key={status}
                onClick={() => triggerStatus(status)}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 justify-start h-auto p-3"
              >
                <div className="text-left">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Banner Visibility */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
            <span className="text-gray-400">Banner:</span>
            <Badge variant={state.isBannerVisible ? 'default' : 'secondary'}>
              {state.isBannerVisible ? 'Visible' : 'Hidden'}
            </Badge>
            {state.messages.length > 0 && (
              <span className="text-xs text-gray-500">
                ({state.messages.length} message{state.messages.length !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDemoCard;