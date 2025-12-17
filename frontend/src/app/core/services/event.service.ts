import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventDetail, PaginatedEvents } from '../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(page: number = 1, pageSize: number = 12): Observable<PaginatedEvents> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedEvents>(this.apiUrl, { params });
  }

  getEventById(id: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(`${this.apiUrl}/${id}`);
  }

  searchEvents(query: string, page: number = 1): Observable<PaginatedEvents> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());
    
    return this.http.get<PaginatedEvents>(`${this.apiUrl}/search`, { params });
  }

  getEventPhotos(eventId: number, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString());
    
    return this.http.get(`${this.apiUrl}/${eventId}/photos`, { params });
  }
}
