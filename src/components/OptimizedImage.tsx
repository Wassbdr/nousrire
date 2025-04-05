import React, { useState } from 'react';
import { getImagePath } from '../utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  imageName?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;  
  onError?: () => void; 
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  imageName,
  width,
  height,
  onLoad,
  onError
}) => {
  const [error, setError] = useState(false);
  
  // If imageName is provided, try to use local path first
  const imageSrc = imageName ? getImagePath(imageName, src) : src;
  
  const handleError = () => {
    setError(true);
    if (onError) onError();
  };
  
  const handleLoad = () => {
    if (onLoad) onLoad();
  };
  
  return (
    <img
      src={error ? '/images/optimized/placeholder.webp' : imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};