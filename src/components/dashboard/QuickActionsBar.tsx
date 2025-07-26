import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, MessageCircle, Calendar, Plus, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
interface QuickActionsBarProps {
  onNewCollaboration: () => void;
  onUploadTrack: () => void;
  onOpenMessages: () => void;
  onScheduleSession: () => void;
}
const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onNewCollaboration,
  onUploadTrack,
  onOpenMessages,
  onScheduleSession
}) => {
  const quickActions = [{
    icon: Upload,
    label: 'Upload Track',
    action: onUploadTrack,
    className: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
  }, {
    icon: MessageCircle,
    label: 'Message',
    action: onOpenMessages,
    className: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  }, {
    icon: Calendar,
    label: 'Schedule Session',
    action: onScheduleSession,
    className: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  }];
  return <>
      {/* Floating Action Button - Always Visible */}
      

      {/* Quick Actions Desktop Bar */}
      <div className="hidden lg:flex fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center space-x-3 bg-card/95 backdrop-blur-xl border border-saffron/20 rounded-full px-4 py-2 shadow-lg">
          {quickActions.map((action, index) => {
          const Icon = action.icon;
          return <Button key={index} onClick={action.action} className={cn("rounded-full w-12 h-12 text-white shadow-sm", "transition-all duration-300 hover:scale-110 active:scale-95", action.className)} size="icon">
                <Icon className="w-5 h-5" />
                <span className="sr-only">{action.label}</span>
              </Button>;
        })}
        </div>
      </div>

      {/* Voice Search Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <Button className={cn("w-14 h-14 rounded-full shadow-lg", "bg-gradient-to-r from-red-500 to-red-600", "hover:from-red-600 hover:to-red-700", "transition-all duration-300 hover:scale-110 active:scale-95")} size="icon">
          <Mic className="w-6 h-6 text-white" />
          <span className="sr-only">Voice Search</span>
        </Button>
      </div>
    </>;
};
export default QuickActionsBar;