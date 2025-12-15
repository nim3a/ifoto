import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotoService, PhotoMatch } from '../../core/services/photo.service';

@Component({
  selector: 'app-face-search',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './face-search.component.html',
  styleUrls: ['./face-search.component.scss']
})
export class FaceSearchComponent implements OnInit {
  eventId: number | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  searching = false;
  searchResults: PhotoMatch[] = [];
  hasSearched = false;

  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('eventId');
      if (id) {
        this.eventId = parseInt(id, 10);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('يرجى اختيار صورة صالحة', 'إغلاق', { duration: 3000 });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('حجم الصورة يجب أن يكون أقل من 10 ميجابايت', 'إغلاق', { duration: 3000 });
        return;
      }

      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.searchResults = [];
    this.hasSearched = false;
  }

  searchByFace(): void {
    if (!this.selectedFile || !this.eventId) return;

    this.searching = true;
    this.searchResults = [];

    this.photoService.searchByFace(this.eventId, this.selectedFile).subscribe({
      next: (response) => {
        this.searchResults = response.matches;
        this.hasSearched = true;
        this.searching = false;

        if (this.searchResults.length === 0) {
          this.snackBar.open('لم يتم العثور على صور مطابقة', 'إغلاق', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.searching = false;
        this.hasSearched = true;
        
        let errorMessage = 'فشل البحث. يرجى المحاولة مرة أخرى.';
        if (err.error?.error?.includes('No face detected')) {
          errorMessage = 'لم يتم اكتشاف وجه في الصورة. يرجى تحميل صورة واضحة.';
        }
        
        this.snackBar.open(errorMessage, 'إغلاق', { duration: 5000 });
      }
    });
  }

  navigateToGallery(): void {
    if (this.eventId) {
      this.router.navigate(['/gallery', this.eventId]);
    }
  }

  getPhotoUrl(storagePath: string): string {
    return `${storagePath}`;
  }

  getSimilarityPercentage(similarity: number): number {
    return Math.round(similarity * 100);
  }

  getSimilarityColor(similarity: number): string {
    if (similarity >= 0.8) return 'success';
    if (similarity >= 0.6) return 'warn';
    return 'default';
  }
}
