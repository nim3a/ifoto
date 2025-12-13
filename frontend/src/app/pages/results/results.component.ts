import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

interface PhotoResult {
  id: string;
  url: string;
  similarity: number;
  eventName: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="results-container">
      <div class="content">
        <a routerLink="/search" class="back-link">← New Search</a>
        
        <h1>Search Results</h1>
        <p class="subtitle">Photos matching your search</p>
        
        @if (isLoading()) {
          <div class="loading">
            <p>Loading results...</p>
          </div>
        } @else if (results().length > 0) {
          <div class="results-grid">
            @for (photo of results(); track photo.id) {
              <div class="photo-card">
                <div class="photo-placeholder">
                  <span>📷</span>
                </div>
                <div class="photo-info">
                  <p class="event-name">{{ photo.eventName }}</p>
                  <p class="similarity">{{ (photo.similarity * 100).toFixed(0) }}% match</p>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="no-results">
            <p>No matching photos found</p>
            <a routerLink="/search" class="btn btn-primary">Try Another Search</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      min-height: 100vh;
      padding: 2rem;
      background: #ffffff;
    }
    
    .content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .back-link {
      color: #666666;
      text-decoration: none;
      margin-bottom: 2rem;
      display: inline-block;
    }
    
    .back-link:hover {
      color: #000000;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #000000;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
      color: #666666;
      margin-bottom: 2rem;
    }
    
    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: #666666;
    }
    
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .photo-card {
      border: 1px solid #e0e0e0;
      background: #fafafa;
      overflow: hidden;
    }
    
    .photo-placeholder {
      aspect-ratio: 4/3;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      font-size: 4rem;
    }
    
    .photo-info {
      padding: 1rem;
    }
    
    .event-name {
      font-weight: 600;
      color: #000000;
      margin-bottom: 0.25rem;
    }
    
    .similarity {
      color: #666666;
      font-size: 0.875rem;
    }
    
    .no-results {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .no-results p {
      color: #666666;
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      border: 2px solid #000000;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-block;
    }
    
    .btn-primary {
      background: #000000;
      color: #ffffff;
    }
    
    .btn-primary:hover {
      background: #333333;
    }
  `]
})
export class ResultsComponent implements OnInit {
  results = signal<PhotoResult[]>([]);
  isLoading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Simulate loading results
    // In real app: this.apiService.get<PhotoResult[]>('/api/search/results')
    setTimeout(() => {
      this.results.set([
        { id: '1', url: '', similarity: 0.95, eventName: 'Birthday Party 2024' },
        { id: '2', url: '', similarity: 0.92, eventName: 'Birthday Party 2024' },
        { id: '3', url: '', similarity: 0.88, eventName: 'Wedding Reception' },
        { id: '4', url: '', similarity: 0.85, eventName: 'Corporate Event' },
        { id: '5', url: '', similarity: 0.82, eventName: 'Birthday Party 2024' },
        { id: '6', url: '', similarity: 0.78, eventName: 'Family Reunion' }
      ]);
      this.isLoading.set(false);
    }, 1000);
  }
}
