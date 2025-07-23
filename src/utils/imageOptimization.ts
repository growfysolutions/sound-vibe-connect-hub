export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  progressive?: boolean;
}

export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> => {
  const {
    quality = 0.8,
    format = 'webp',
    width,
    height
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Calculate dimensions
      let { width: imgWidth, height: imgHeight } = img;
      
      if (width || height) {
        const aspectRatio = imgWidth / imgHeight;
        
        if (width && height) {
          imgWidth = width;
          imgHeight = height;
        } else if (width) {
          imgWidth = width;
          imgHeight = width / aspectRatio;
        } else if (height) {
          imgHeight = height;
          imgWidth = height * aspectRatio;
        }
      }

      canvas.width = imgWidth;
      canvas.height = imgHeight;

      // Draw and optimize
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        `image/${format}`,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const generateImageSizes = async (
  file: File,
  sizes: number[] = [256, 512, 1024]
): Promise<{ size: number; blob: Blob }[]> => {
  const results = await Promise.all(
    sizes.map(async (size) => {
      const blob = await optimizeImage(file, {
        width: size,
        height: size,
        format: 'webp',
        quality: 0.8
      });
      return { size, blob };
    })
  );
  
  return results;
};

export const createCulturalPattern = (
  pattern: 'phulkari' | 'paisley' | 'geometric',
  size: number = 100
): string => {
  const patterns = {
    phulkari: `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="phulkari" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#ff6b35" opacity="0.1"/>
            <circle cx="10" cy="10" r="3" fill="#ff6b35" opacity="0.3"/>
            <path d="M10 5 L15 10 L10 15 L5 10 Z" fill="#ff6b35" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#phulkari)"/>
      </svg>
    `,
    paisley: `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="paisley" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <rect width="25" height="25" fill="#ff6b35" opacity="0.05"/>
            <path d="M12.5 5 C17.5 5 20 10 17.5 15 C15 20 10 20 7.5 15 C5 10 7.5 5 12.5 5 Z" fill="#ff6b35" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#paisley)"/>
      </svg>
    `,
    geometric: `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geometric" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#ff6b35" opacity="0.05"/>
            <polygon points="15,5 25,15 15,25 5,15" fill="#ff6b35" opacity="0.15"/>
            <circle cx="15" cy="15" r="2" fill="#ff6b35" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric)"/>
      </svg>
    `
  };

  return `data:image/svg+xml;base64,${btoa(patterns[pattern])}`;
};
