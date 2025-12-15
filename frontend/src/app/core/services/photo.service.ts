import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PhotoUploadResponse {
  id: number;
  fileName: string;
  storagePath: string;
  fileSize: number;
  faceCount: number;
  uploadedAt: string;
}

export interface GalleryPhoto {
  id: number;
  fileName: string;
  storagePath: string;
  faceCount: number;
  uploadedAt: string;
}

export interface FaceSearchResponse {
  matches: PhotoMatch[];
  totalMatches: number;
}

export interface PhotoMatch {
  photoId: number;
  photoUrl: string;
  thumbnailUrl: string | null;
  similarity: number;
  faceLocation: FaceLocation | null;
}

export interface FaceLocation {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private api: ApiService) { }

  uploadPhoto(eventId: number, file: File): Observable<PhotoUploadResponse> {
    return this.api.uploadFile<PhotoUploadResponse>('/api/photos/upload', file, {
      eventId: eventId.toString()
    });
  }

  getEventPhotos(eventId: number): Observable<GalleryPhoto[]> {
    return this.api.get<GalleryPhoto[]>(`/api/photos/events/${eventId}`);
  }

  searchByFace(
    eventId: number,
    file: File,
    limit?: number,
    threshold?: number
  ): Observable<FaceSearchResponse> {
    const additionalData: Record<string, string> = {
      eventId: eventId.toString()
    };
    
    if (limit !== undefined) {
      additionalData['limit'] = limit.toString();
    }
    
    if (threshold !== undefined) {
      additionalData['threshold'] = threshold.toString();
    }
    
    return this.api.uploadFile<FaceSearchResponse>('/api/photos/search-by-face', file, additionalData);
  }
}
