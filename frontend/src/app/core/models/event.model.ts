export interface Event {
  id: number;
  title: string;
  description?: string;
  coverImageUrl: string;
  eventDate: string;
  location?: string;
  photoCount: number;
  category?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export interface EventDetail extends Event {
  photos: EventPhoto[];
}

export interface EventPhoto {
  id: number;
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  // legacy alias
  bibNumber?: string;
  capturedAt?: string;
  // legacy alias for takenAt
  takenAt?: string;
  metadata?: Record<string, any>;
}

export interface PaginatedEvents {
  items: Event[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize?: number;
}
