export const getFileValidationMessage = (file: File | null): string | null => {
  if (!file) return null;

  if (file.type.includes("quicktime")) {
    return "Invalid file type. Please upload an image or video.";
  }

  if (file.size > 10 * 1024 * 1024) {
    // 10MB limit
    return "File size exceeds 10MB limit.";
  }

  return null;
};
