export type ImageMetadata = {
  resolution: string;
  type?: string;
  creation_time?: string;
};

export type VideoMetadata = {
  resolution: string;
  aspect_ratio?: string;
  quality?: string;
  duration?: string;
  creation_time?: string;
};

export type MediaItem = {
  id: string;
  filename: string;
  media_type: string;
  title: string;
  description: string;
  category: string;
  file_path: string;
  original_filename?: string;
  upload_date?: string;
} & (
  | { media_type: string; technical_metadata?: ImageMetadata }
  | { media_type: string; technical_metadata?: VideoMetadata }
);
