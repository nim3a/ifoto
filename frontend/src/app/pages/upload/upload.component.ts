import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

interface UploadResponse {
  message: string;
  eventId?: string;
  uploadedCount?: number;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="upload-container">
      <div class="content">
        <a routerLink="/" class="back-link">← Back</a>
        
        <h1>Upload Event Photos</h1>
        <p class="subtitle">Upload photos for your event</p>
        
        <div class="upload-area" (click)="fileInput.click()" 
             [class.dragging]="isDragging()"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          <div class="upload-icon">📁</div>
          <p>Click to select files or drag & drop</p>
          <p class="hint">Support: JPG, PNG (max 10MB each)</p>
          <input #fileInput type="file" multiple accept="image/*" 
                 (change)="onFileSelected($event)" style="display: none">
        </div>
        
        @if (selectedFiles().length > 0) {
          <div class="selected-files">
            <h3>Selected Files ({{ selectedFiles().length }})</h3>
            <div class="file-list">
              @for (file of selectedFiles(); track file.name) {
                <div class="file-item">
                  <span>{{ file.name }}</span>
                  <button (click)="removeFile(file)" class="remove-btn">×</button>
                </div>
              }
            </div>
            <button class="btn btn-primary" (click)="uploadFiles()" 
                    [disabled]="isUploading()">
              {{ isUploading() ? 'Uploading...' : 'Upload Files' }}
            </button>
          </div>
        }
        
        @if (uploadMessage()) {
          <div class="message" [class.success]="uploadSuccess()">
            {{ uploadMessage() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
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
    
    .upload-area {
      border: 2px dashed #cccccc;
      padding: 4rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
    }
    
    .upload-area:hover, .upload-area.dragging {
      border-color: #000000;
      background: #f0f0f0;
    }
    
    .upload-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .upload-area p {
      color: #666666;
      margin: 0.5rem 0;
    }
    
    .hint {
      font-size: 0.875rem;
      color: #999999;
    }
    
    .selected-files {
      margin-top: 2rem;
    }
    
    .selected-files h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000000;
      margin-bottom: 1rem;
    }
    
    .file-list {
      margin-bottom: 1.5rem;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
      margin-bottom: 0.5rem;
    }
    
    .file-item span {
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .remove-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #999999;
      cursor: pointer;
      padding: 0 0.5rem;
    }
    
    .remove-btn:hover {
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
export class UploadComponent {
  selectedFiles = signal<File[]>([]);
  isDragging = signal(false);
  isUploading = signal(false);
  uploadMessage = signal('');
  uploadSuccess = signal(false);

  constructor(private apiService: ApiService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  addFiles(files: File[]): void {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    this.selectedFiles.update(current => [...current, ...imageFiles]);
  }

  removeFile(file: File): void {
    this.selectedFiles.update(files => files.filter(f => f !== file));
  }

  uploadFiles(): void {
    if (this.selectedFiles().length === 0) return;
    
    this.isUploading.set(true);
    this.uploadMessage.set('');
    
    // For now, just simulate upload - in real app, would upload each file
    // using apiService.uploadFile('/api/events/upload', file)
    setTimeout(() => {
      this.isUploading.set(false);
      this.uploadSuccess.set(true);
      this.uploadMessage.set(`Successfully uploaded ${this.selectedFiles().length} files`);
      this.selectedFiles.set([]);
    }, 2000);
  }
}
