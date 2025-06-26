import { useState, useCallback } from "react";
import { PreviewState } from "./types";

export const useFilePreview = () => {
  const [preview, setPreview] = useState<PreviewState>({
    url: null,
    type: null,
  });

  const updatePreview = useCallback(
    (file: File | null) => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }

      if (!file) {
        setPreview({ url: null, type: null });
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview({ url, type: file.type });
    },
    [preview.url]
  );

  const clearPreview = useCallback(() => {
    if (preview.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview({ url: null, type: null });
  }, [preview.url]);

  return {
    preview,
    updatePreview,
    clearPreview,
  };
};

export const useUploadState = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploading,
    setUploading,
    error,
    setError,
    clearError,
  };
};

const getFileValidationMessage = (file: File | null): string | null => {
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
