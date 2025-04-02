import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  // First, validate the file
  if (!file) {
    throw new Error("Aucun fichier fourni");
  }
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error("Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.");
  }
  
  // Validate file size (max 10MB before compression)
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Fichier trop volumineux. Maximum ${maxSizeMB}MB.`);
  }
  
  // Compression options
  const options = {
    maxSizeMB: 1, // Compress to 1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    fileType: file.type
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Erreur lors de la compression de l'image:", error);
    throw new Error("Impossible de compresser l'image. Veuillez réessayer avec une autre image.");
  }
};