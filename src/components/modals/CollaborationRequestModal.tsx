
import React, { useState } from 'react';
import { CulturalModal } from './CulturalModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Paperclip, X } from 'lucide-react';
import { DholLoader } from '@/components/ui/DholLoader';
import { toast } from 'sonner';

interface CollaborationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: string;
}

export const CollaborationRequestModal: React.FC<CollaborationRequestModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientId
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    roleNeeded: '',
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    message: '',
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setAttachedFile(file);
      setHasUnsavedChanges(true);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.projectName || !formData.roleNeeded || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success animation with cultural elements
      toast.success('Collaboration request sent successfully!', {
        description: `Your request has been sent to ${recipientName}`,
        duration: 4000,
      });
      
      setHasUnsavedChanges(false);
      onClose();
      
      // Reset form
      setFormData({
        projectName: '',
        roleNeeded: '',
        budgetMin: '',
        budgetMax: '',
        timeline: '',
        message: '',
      });
      setAttachedFile(null);
      
    } catch (error) {
      toast.error('Failed to send collaboration request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CulturalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Send Collaboration Request to ${recipientName}`}
      maxWidth="lg"
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div id="modal-description" className="sr-only">
        Form to send a collaboration request with project details and requirements
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-sm font-medium text-foreground">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            placeholder="e.g., Sikh Heritage Documentary Soundtrack"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            required
            className="focus:ring-saffron focus:border-saffron"
          />
        </div>

        {/* Role Needed */}
        <div className="space-y-2">
          <Label htmlFor="roleNeeded" className="text-sm font-medium text-foreground">
            Role Needed <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(value) => handleInputChange('roleNeeded', value)}>
            <SelectTrigger className="focus:ring-saffron focus:border-saffron">
              <SelectValue placeholder="Select the role you need" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vocalist">Vocalist</SelectItem>
              <SelectItem value="tabla">Tabla Player</SelectItem>
              <SelectItem value="guitarist">Guitarist</SelectItem>
              <SelectItem value="harmonium">Harmonium Player</SelectItem>
              <SelectItem value="percussionist">Percussionist</SelectItem>
              <SelectItem value="producer">Producer</SelectItem>
              <SelectItem value="songwriter">Songwriter</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Project Budget</Label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Input
                placeholder="Min (₹)"
                value={formData.budgetMin}
                onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                className="focus:ring-saffron focus:border-saffron"
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <div className="flex-1">
              <Input
                placeholder="Max (₹)"
                value={formData.budgetMax}
                onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                className="focus:ring-saffron focus:border-saffron"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label htmlFor="timeline" className="text-sm font-medium text-foreground">
            Timeline
          </Label>
          <Input
            id="timeline"
            placeholder="e.g., 3 weeks (Starting March 15)"
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            className="focus:ring-saffron focus:border-saffron"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-foreground">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Hi Rajveer, I'm working on a documentary about Sikh heritage and need authentic tabla accompaniment for 5 tracks. Your work on 'Gurdwara Sessions' really resonated with our vision..."
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            required
            className="focus:ring-saffron focus:border-saffron resize-none"
          />
        </div>

        {/* File Attachment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Attachment (Optional)
          </Label>
          <div className="border-2 border-dashed border-saffron/20 rounded-lg p-4 hover:border-saffron/40 transition-colors">
            {attachedFile ? (
              <div className="flex items-center justify-between bg-saffron/5 p-3 rounded-md">
                <div className="flex items-center space-x-3">
                  <Paperclip className="w-4 h-4 text-saffron" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{attachedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  className="sr-only"
                  accept="audio/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-saffron/60 mb-2" />
                  <p className="text-sm text-foreground">
                    <span className="font-medium text-saffron">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Audio, video, or document files (max 50MB)
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-saffron/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-saffron/20 text-foreground hover:bg-saffron/5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.projectName || !formData.roleNeeded || !formData.message}
            className="bg-saffron text-white hover:bg-saffron/90 focus:ring-saffron focus:ring-opacity-50"
          >
            {isLoading ? (
              <>
                <DholLoader size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </div>
      </form>
    </CulturalModal>
  );
};
