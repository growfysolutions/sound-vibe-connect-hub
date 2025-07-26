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
        
      </div>

      {/* Voice Search Button */}
      
    </>;
};
export default QuickActionsBar;