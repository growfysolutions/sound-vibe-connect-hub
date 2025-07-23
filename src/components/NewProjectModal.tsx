
import React from 'react';
import { Button } from '@/components/ui/button';
import { CollaborationRequestModal } from './modals/CollaborationRequestModal';
import { FileUploadModal } from './modals/FileUploadModal';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { useModal } from '@/hooks/useModal';
import { toast } from 'sonner';

const NewProjectModal: React.FC = () => {
  const collaborationModal = useModal();
  const fileUploadModal = useModal();
  const confirmationModal = useModal();

  const handleFileUpload = async (file: File, metadata: any) => {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('File uploaded:', file.name, metadata);
  };

  const handleConfirmAction = () => {
    toast.success('Action confirmed!');
    confirmationModal.closeModal();
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">SoundVibe Modal System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          onClick={() => collaborationModal.openModal()}
          className="bg-saffron hover:bg-saffron/90 text-white"
        >
          Open Collaboration Request
        </Button>
        
        <Button
          onClick={() => fileUploadModal.openModal()}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Open File Upload
        </Button>
        
        <Button
          onClick={() => confirmationModal.openModal()}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          Open Confirmation
        </Button>
      </div>

      {/* Modal Components */}
      <CollaborationRequestModal
        isOpen={collaborationModal.isOpen}
        onClose={collaborationModal.closeModal}
        recipientName="Rajveer Singh"
      />

      <FileUploadModal
        isOpen={fileUploadModal.isOpen}
        onClose={fileUploadModal.closeModal}
        onUpload={handleFileUpload}
        title="Upload Project File"
        acceptedTypes="audio/*,video/*,.pdf,.doc,.docx"
        maxSize={50}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.closeModal}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
        type="warning"
        confirmText="Yes, Continue"
        cancelText="Cancel"
      />
    </div>
  );
};

export default NewProjectModal;
