
import React from 'react';
import { CulturalModal } from './CulturalModal';
import { CulturalButton } from '@/components/ui/CulturalButton';
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

  const getConfirmVariant = () => {
    switch (type) {
      case 'danger':
        return 'culturalDestructive';
      case 'success':
        return 'cultural';
      case 'info':
        return 'cultural';
      case 'warning':
      default:
        return 'cultural';
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
          <CulturalButton
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </CulturalButton>
          <CulturalButton
            variant={getConfirmVariant()}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
          >
            {confirmText}
          </CulturalButton>
        </div>
      </div>
    </CulturalModal>
  );
};
