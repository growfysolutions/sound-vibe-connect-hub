
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CulturalFileUpload } from './CulturalFileUpload';
import { CulturalSelect } from './CulturalSelect';
import { CulturalMultiSelect } from './CulturalMultiSelect';
import { CheckCircle, User, Music, Upload, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  fullName: z.string().min(2, 'ਮਾਫ਼ ਕਰਨਾ - Please enter your full name'),
  stageName: z.string().optional(),
  location: z.string().min(1, 'Please select your location'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'professional', 'master']),
  primarySkills: z.array(z.string()).min(1, 'Please select at least one skill'),
  genres: z.array(z.string()).min(1, 'Please select at least one genre'),
  languages: z.array(z.string()).min(1, 'Please select at least one language'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  portfolio: z.array(z.any()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const locationOptions = [
  { value: 'amritsar', label: 'Amritsar, Punjab' },
  { value: 'birmingham', label: 'Birmingham, UK' },
  { value: 'toronto', label: 'Toronto, Canada' },
  { value: 'vancouver', label: 'Vancouver, Canada' },
  { value: 'delhi', label: 'Delhi, India' },
  { value: 'mumbai', label: 'Mumbai, India' },
  { value: 'london', label: 'London, UK' },
  { value: 'california', label: 'California, USA' },
];

const skillOptions = [
  { value: 'vocals', label: 'Vocals', icon: '🎤' },
  { value: 'harmonium', label: 'Harmonium', icon: '🎹' },
  { value: 'tabla', label: 'Tabla', icon: '🥁' },
  { value: 'dhol', label: 'Dhol', icon: '🥁' },
  { value: 'guitar', label: 'Guitar', icon: '🎸' },
  { value: 'flute', label: 'Flute', icon: '🪈' },
  { value: 'violin', label: 'Violin', icon: '🎻' },
  { value: 'keyboard', label: 'Keyboard', icon: '🎹' },
];

const genreOptions = [
  { value: 'traditional_folk', label: 'Traditional Folk' },
  { value: 'bhangra', label: 'Bhangra' },
  { value: 'sufi', label: 'Sufi' },
  { value: 'modern_punjabi', label: 'Modern Punjabi' },
  { value: 'bollywood_fusion', label: 'Bollywood Fusion' },
  { value: 'classical', label: 'Classical' },
  { value: 'devotional', label: 'Devotional' },
  { value: 'contemporary', label: 'Contemporary' },
];

const languageOptions = [
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'english', label: 'English' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'bengali', label: 'Bengali' },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', description: '0-2 years', icon: '🌱' },
  { value: 'intermediate', label: 'Intermediate', description: '3-5 years', icon: '🎭' },
  { value: 'professional', label: 'Professional', description: '6+ years', icon: '🏆' },
  { value: 'master', label: 'Master', description: '10+ years with industry recognition', icon: '👑' },
];

export const ArtistProfileSetupForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      stageName: '',
      location: '',
      experienceLevel: 'beginner',
      primarySkills: [],
      genres: [],
      languages: [],
      bio: '',
      email: '',
      portfolio: [],
    },
  });

  const watchedFields = form.watch();
  const completionPercentage = calculateCompletionPercentage(watchedFields);

  const onSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Trigger marigold celebration animation
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron/5 to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Sparkles className="w-8 h-8 text-saffron" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Profile Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Welcome to the SoundVibe community, {watchedFields.fullName || 'Artist'}!
            </p>
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                  🌼
                </span>
              ))}
            </div>
            <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
              Enter SoundVibe
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/5 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Artist Profile</h1>
          <p className="text-muted-foreground">Join the SoundVibe community and showcase your talent</p>
          <div className="mt-4">
            <Progress value={completionPercentage} className="w-full max-w-md mx-auto h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Profile {completionPercentage}% complete
              {completionPercentage < 100 && ' - Add portfolio samples to reach 100%'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <PersonalInfoSection form={form} locationOptions={locationOptions} />
            )}
            {currentStep === 2 && (
              <SkillsGenresSection 
                form={form} 
                skillOptions={skillOptions}
                genreOptions={genreOptions}
                languageOptions={languageOptions}
              />
            )}
            {currentStep === 3 && (
              <PortfolioSection 
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? 'Submitting...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Helper Components
const PersonalInfoSection = ({ form, locationOptions }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="w-5 h-5" />
        Personal Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Harpreet Singh Brar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., HP Singh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location *</FormLabel>
              <CulturalSelect
                options={locationOptions}
                placeholder="Select your location"
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="experienceLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Level *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {experienceLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <label
                      htmlFor={level.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-lg">{level.icon}</span>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);

const SkillsGenresSection = ({ form, skillOptions, genreOptions, languageOptions }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Music className="w-5 h-5" />
        Skills & Genres
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <FormField
        control={form.control}
        name="primarySkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Skills *</FormLabel>
            <CulturalMultiSelect
              options={skillOptions}
              placeholder="Select your skills"
              value={field.value}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="genres"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Genres *</FormLabel>
            <CulturalMultiSelect
              options={genreOptions}
              placeholder="Select your genres"
              value={field.value}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="languages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Languages *</FormLabel>
            <CulturalMultiSelect
              options={languageOptions}
              placeholder="Select languages you perform in"
              value={field.value}
              onChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your musical journey..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <div className="text-sm text-muted-foreground text-right">
              {field.value?.length || 0}/500 characters
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);

const PortfolioSection = ({ uploadedFiles, setUploadedFiles }: {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Portfolio
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <CulturalFileUpload
        onFilesChange={setUploadedFiles}
        acceptedTypes={['audio/mp3', 'audio/wav', 'audio/flac']}
        maxFileSize={10 * 1024 * 1024} // 10MB
        maxFiles={5}
      />
      
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files:</h4>
          {uploadedFiles.map((file: File, index: number) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
              <Music className="w-4 h-4" />
              <span className="text-sm">{file.name}</span>
              <Badge variant="outline" className="ml-auto">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </Badge>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

function calculateCompletionPercentage(data: any): number {
  const requiredFields = ['fullName', 'email', 'location', 'experienceLevel'];
  const optionalFields = ['stageName', 'bio'];
  const arrayFields = ['primarySkills', 'genres', 'languages'];
  
  let completed = 0;
  let total = requiredFields.length + optionalFields.length + arrayFields.length;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (data[field]) completed++;
  });
  
  // Check optional fields
  optionalFields.forEach(field => {
    if (data[field]) completed++;
  });
  
  // Check array fields
  arrayFields.forEach(field => {
    if (data[field] && data[field].length > 0) completed++;
  });
  
  return Math.round((completed / total) * 100);
}
