
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOutsideClick } from '@/hooks/use-outside-click';

interface CulturalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  hasUnsavedChanges?: boolean;
  showCloseButton?: boolean;
}

export const CulturalModal: React.FC<CulturalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  hasUnsavedChanges = false,
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle outside click with confirmation for unsaved changes
  useOutsideClick(modalRef, () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  });

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal container
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Add keyboard event listener
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
              onClose();
            }
          } else {
            onClose();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    } else {
      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, onClose, hasUnsavedChanges]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop with cultural pattern */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cpath d='M10 0l10 10-10 10L0 10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-card rounded-lg shadow-2xl animate-scale-in',
          'border-2 border-hsl(var(--ocean-blue))/20',
          'focus:outline-none focus:ring-2 focus:ring-hsl(var(--ocean-blue)) focus:ring-opacity-50',
          maxWidthClasses[maxWidth]
        )}
        tabIndex={-1}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23007acc' fill-opacity='0.02'%3E%3Cpath d='M20 0l20 20-20 20L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Header with cultural design */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-hsl(var(--ocean-blue))/10 to-hsl(var(--teal))/10 rounded-t-lg border-b border-hsl(var(--ocean-blue))/20">
          <div className="absolute inset-0 opacity-5 rounded-t-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23007acc'%3E%3Cpath d='M30 0l15 15-15 15-15-15z'/%3E%3Cpath d='M30 30l15 15-15 15-15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-hsl(var(--ocean-blue))/10 transition-colors focus:outline-none focus:ring-2 focus:ring-hsl(var(--ocean-blue)) focus:ring-opacity-50"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};
