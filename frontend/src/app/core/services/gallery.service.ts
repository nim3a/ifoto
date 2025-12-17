import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gallery, GalleryDetail, PaginatedGalleries } from '../models/gallery.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = `${environment.apiUrl}/galleries`;

  constructor(private http: HttpClient) {}

  getGalleries(page: number = 1, pageSize: number = 12): Observable<PaginatedGalleries> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedGalleries>(this.apiUrl, { params });
  }

  getGalleryById(id: number): Observable<GalleryDetail> {
    return this.http.get<GalleryDetail>(`${this.apiUrl}/${id}`);
  }

  searchGalleries(query: string, page: number = 1): Observable<PaginatedGalleries> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());
    
    return this.http.get<PaginatedGalleries>(`${this.apiUrl}/search`, { params });
  }
}
