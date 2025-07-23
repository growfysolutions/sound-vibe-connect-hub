
import React from 'react';
import { CulturalModal } from './CulturalModal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      case 'danger':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'warning':
      default:
        return 'bg-amber-500 hover:bg-amber-600 text-white';
    }
  };

  return (
    <CulturalModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      showCloseButton={false}
    >
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>

        {/* Message */}
        <p className="text-foreground leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-saffron/20 text-foreground hover:bg-saffron/5"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={getButtonStyle()}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </CulturalModal>
  );
};
