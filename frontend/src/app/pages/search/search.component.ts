import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

interface SearchResponse {
  matches: Array<{
    photoId: string;
    similarity: number;
    url: string;
  }>;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="search-container">
      <div class="content">
        <a routerLink="/" class="back-link">← Back</a>
        
        <h1>Face Search</h1>
        <p class="subtitle">Upload a selfie to find your photos</p>
        
        <div class="search-area">
          @if (!selectedImage()) {
            <div class="upload-box" (click)="fileInput.click()">
              <div class="icon">📷</div>
              <p>Click to upload a selfie</p>
              <p class="hint">JPG or PNG, clear face photo</p>
              <input #fileInput type="file" accept="image/*" 
                     (change)="onFileSelected($event)" style="display: none">
            </div>
          } @else {
            <div class="preview">
              <img [src]="selectedImage()" alt="Selected photo">
              <button class="change-btn" (click)="clearImage()">Change Photo</button>
            </div>
          }
          
          @if (selectedImage()) {
            <button class="btn btn-primary" (click)="searchFaces()" 
                    [disabled]="isSearching()">
              {{ isSearching() ? 'Searching...' : 'Search for My Photos' }}
            </button>
          }
        </div>
        
        @if (searchMessage()) {
          <div class="message" [class.success]="searchSuccess()">
            {{ searchMessage() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      min-height: 100vh;
      padding: 2rem;
      background: #ffffff;
    }
    
    .content {
      max-width: 800px;
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
    
    .search-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .upload-box {
      border: 2px dashed #cccccc;
      padding: 4rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
    }
    
    .upload-box:hover {
      border-color: #000000;
      background: #f0f0f0;
    }
    
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .upload-box p {
      color: #666666;
      margin: 0.5rem 0;
    }
    
    .hint {
      font-size: 0.875rem;
      color: #999999;
    }
    
    .preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .preview img {
      max-width: 400px;
      max-height: 400px;
      width: 100%;
      height: auto;
      border: 2px solid #e0e0e0;
    }
    
    .change-btn {
      padding: 0.5rem 1.5rem;
      background: #f0f0f0;
      border: 1px solid #cccccc;
      cursor: pointer;
      color: #666666;
    }
    
    .change-btn:hover {
      background: #e0e0e0;
      color: #000000;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      border: 2px solid #000000;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #000000;
      color: #ffffff;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #333333;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .message {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #ffe0e0;
      border: 1px solid #ffcccc;
      color: #cc0000;
    }
    
    .message.success {
      background: #e0ffe0;
      border: 1px solid #ccffcc;
      color: #006600;
    }
  `]
})
export class SearchComponent {
  selectedImage = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isSearching = signal(false);
  searchMessage = signal('');
  searchSuccess = signal(false);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.selectedImage.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage(): void {
    this.selectedImage.set(null);
    this.selectedFile.set(null);
    this.searchMessage.set('');
  }

  searchFaces(): void {
    const file = this.selectedFile();
    if (!file) return;
    
    this.isSearching.set(true);
    this.searchMessage.set('');
    
    // For now, simulate search - in real app, would call:
    // this.apiService.uploadFile<SearchResponse>('/api/search/face', file)
    setTimeout(() => {
      this.isSearching.set(false);
      this.searchSuccess.set(true);
      this.searchMessage.set('Search completed! Redirecting to results...');
      
      setTimeout(() => {
        this.router.navigate(['/results']);
      }, 1500);
    }, 2000);
  }
}
