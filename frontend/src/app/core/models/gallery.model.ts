export interface Gallery {
  id: number;
  title: string;
  description?: string;
  coverImageUrl: string;
  eventDate?: string;
  location?: string;
  photoCount: number;
  category?: string;
  createdAt?: string;
}

export interface GalleryDetail extends Gallery {
  photos: Photo[];
}

export interface Photo {
  id: number;
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  // legacy alias for fileName
  title?: string;
  capturedAt?: string;
  // legacy alias for takenAt
  takenAt?: string;
  metadata?: Record<string, any>;
}

export interface PaginatedGalleries {
  items: Gallery[];
  // New pagination shape expected by components
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize?: number;
}
