export type MyFormData = {
  file: FileList;
  title: string;
  description: string;
  category: string;
  // metadata: string;
};

export type PreviewState = {
  url: string | null;
  type: string | null;
};

export type FileMetadata = {
  size?: string;
  type?: string;
  lastModified?: string;
  duration?: string;
  dimensions?: string;
  isVideo?: boolean;
};
