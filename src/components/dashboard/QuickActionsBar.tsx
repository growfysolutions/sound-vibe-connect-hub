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
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <Button onClick={onNewCollaboration} className={cn("w-14 h-14 rounded-full shadow-lg", "bg-gradient-to-r from-saffron to-gold-600 hover:from-saffron/90 hover:to-gold-700", "text-white hover:scale-105 transition-all duration-300")}>
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Quick Actions Desktop Bar */}
      <div className="hidden lg:flex fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        
      </div>

      {/* Voice Search Button */}
      <div className="fixed bottom-24 right-6 z-40 lg:hidden">
        <Button className={cn("w-12 h-12 rounded-full shadow-md", "bg-card/90 backdrop-blur-sm border border-border", "text-muted-foreground hover:text-foreground", "hover:scale-105 transition-all duration-300")} title="Voice Search">
          <Mic className="w-5 h-5" />
        </Button>
      </div>
    </>;
};
export default QuickActionsBar;