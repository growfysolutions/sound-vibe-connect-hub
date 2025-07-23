
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageCircle, Camera, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface FeedbackData {
  type: 'quick' | 'detailed';
  rating: 'positive' | 'negative' | null;
  category: string;
  message: string;
  screenshot?: string;
}

export const CulturalFeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'quick' | 'detailed'>('quick');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const { toast } = useToast();

  const categories = [
    { id: 'authenticity', label: 'Cultural Authenticity', emoji: '🎭', description: 'Does this feel genuinely Punjabi?' },
    { id: 'utility', label: 'Professional Utility', emoji: '🎵', description: 'Does this help your music career?' },
    { id: 'visual', label: 'Visual Appeal', emoji: '🎨', description: 'Is this aesthetically pleasing?' },
    { id: 'usability', label: 'Usability', emoji: '🔧', description: 'Is this easy to use?' },
    { id: 'performance', label: 'Performance', emoji: '⚡', description: 'Does this load quickly?' }
  ];

  const handleQuickFeedback = (type: 'positive' | 'negative') => {
    setRating(type);
    // Submit quick feedback
    submitFeedback({ type: 'quick', rating: type, category: '', message: '' });
  };

  const submitFeedback = async (feedback: FeedbackData) => {
    try {
      // Here you would integrate with your feedback API
      console.log('Submitting feedback:', feedback);
      
      toast({
        title: "Feedback Submitted! 🙏",
        description: "Your input helps us preserve cultural authenticity while building great tools.",
      });
      
      setIsOpen(false);
      setMessage('');
      setSelectedCategory('');
      setRating(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleDetailedSubmit = () => {
    if (!selectedCategory || !message.trim()) {
      toast({
        title: "Please complete all fields",
        description: "We need both category and detailed feedback.",
        variant: "destructive"
      });
      return;
    }

    submitFeedback({
      type: 'detailed',
      rating,
      category: selectedCategory,
      message: message.trim()
    });
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron/90 hover:to-amber-600 text-white shadow-lg shadow-saffron/25 rounded-full w-14 h-14 p-0"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Feedback Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-saffron">
              🎭 Community Feedback
              <Badge variant="outline" className="ml-auto">
                Cultural Authenticity Focus
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Feedback Type Selection */}
            <div className="flex gap-4">
              <Button
                variant={feedbackType === 'quick' ? 'default' : 'outline'}
                onClick={() => setFeedbackType('quick')}
                className="flex-1"
              >
                Quick Feedback
              </Button>
              <Button
                variant={feedbackType === 'detailed' ? 'default' : 'outline'}
                onClick={() => setFeedbackType('detailed')}
                className="flex-1"
              >
                Detailed Feedback
              </Button>
            </div>

            {feedbackType === 'quick' ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">How does this feel?</p>
                <div className="flex justify-center gap-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleQuickFeedback('positive')}
                    className="flex flex-col gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-200"
                  >
                    <div className="text-2xl">👍</div>
                    <span>Authentic & Helpful</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleQuickFeedback('negative')}
                    className="flex flex-col gap-2 h-auto py-4 hover:bg-red-50 hover:border-red-200"
                  >
                    <div className="text-2xl">👎</div>
                    <span>Needs Improvement</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    What aspect would you like to comment on?
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category.id)}
                        className="justify-start h-auto p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.emoji}</span>
                          <div className="text-left">
                            <div className="font-medium">{category.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Overall Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Overall feeling about this feature:
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={rating === 'positive' ? 'default' : 'outline'}
                      onClick={() => setRating('positive')}
                      size="sm"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Positive
                    </Button>
                    <Button
                      variant={rating === 'negative' ? 'default' : 'outline'}
                      onClick={() => setRating('negative')}
                      size="sm"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Needs Work
                    </Button>
                  </div>
                </div>

                {/* Detailed Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tell us more (your voice matters to our community):
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts on cultural authenticity, usability, or suggestions for improvement..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleDetailedSubmit}
                  className="w-full bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron/90 hover:to-amber-600"
                >
                  Submit Feedback 🙏
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
