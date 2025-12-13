import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) { }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          this.setUserSession(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('ifoto_token');
    localStorage.removeItem('ifoto_user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('ifoto_token');
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  private setUserSession(response: AuthResponse): void {
    localStorage.setItem('ifoto_token', response.token);
    localStorage.setItem('ifoto_user', JSON.stringify(response));
    this.currentUserSubject.next(response);
  }

  private getUserFromStorage(): AuthResponse | null {
    const userJson = localStorage.getItem('ifoto_user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
