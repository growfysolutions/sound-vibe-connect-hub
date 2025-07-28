
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  document: ['application/pdf', 'text/plain']
};

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB for audio

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size exceeds 100MB limit' };
  }

  // Check file type
  const allAllowedTypes = [
    ...ALLOWED_FILE_TYPES.image,
    ...ALLOWED_FILE_TYPES.audio,
    ...ALLOWED_FILE_TYPES.video,
    ...ALLOWED_FILE_TYPES.document
  ];

  if (!allAllowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }

  // Additional size checks by type
  if (ALLOWED_FILE_TYPES.image.includes(file.type) && file.size > MAX_IMAGE_SIZE) {
    return { isValid: false, error: 'Image size exceeds 10MB limit' };
  }

  if (ALLOWED_FILE_TYPES.audio.includes(file.type) && file.size > MAX_AUDIO_SIZE) {
    return { isValid: false, error: 'Audio size exceeds 50MB limit' };
  }

  // Check for potential malicious file names
  const maliciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.com$/i,
    /\.pif$/i,
    /\.scr$/i,
    /\.js$/i,
    /\.vbs$/i,
    /\.jar$/i,
    /\.php$/i,
    /\.html$/i,
    /\.htm$/i
  ];

  if (maliciousPatterns.some(pattern => pattern.test(file.name))) {
    return { isValid: false, error: 'File extension not allowed' };
  }

  return { isValid: true };
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
};
