import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { EventService } from '../../core/services/event.service';
import { EventDetail, EventPhoto } from '../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event: EventDetail | null = null;
  filteredPhotos: EventPhoto[] = [];
  isLoading = true;
  error: string | null = null;
  selectedTab: 'all' | 'search' | 'face' = 'all';
  searchQuery = '';
  selectedPhoto: EventPhoto | null = null;
  selectedPhotoIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadEvent(id);
      }
    });
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.eventService.getEventById(id).subscribe({
      next: (event: EventDetail) => {
        this.event = event;
        this.filteredPhotos = event.photos;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری رویداد. لطفاً دوباره تلاش کنید.';
        this.isLoading = false;
        console.error('Error loading event:', err);
      }
    });
  }

  selectTab(tab: 'all' | 'search' | 'face'): void {
    this.selectedTab = tab;
    this.searchQuery = '';
    if (tab === 'all' && this.event) {
      this.filteredPhotos = this.event.photos;
    }
  }

  onSearchPhotos(): void {
    if (!this.event || !this.searchQuery.trim()) {
      this.filteredPhotos = this.event?.photos || [];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredPhotos = this.event.photos.filter(photo => 
      photo.fileName.toLowerCase().includes(query) ||
      (photo.metadata && JSON.stringify(photo.metadata).toLowerCase().includes(query))
    );
  }

  onFaceSearch(file: Event): void {
    // This would typically upload the face image and call the face search API
    // For now, we'll just show a placeholder message
    console.log('Face search with file:', file);
    alert('جستجو با تصویر چهره به زودی فعال خواهد شد');
  }

  openLightbox(photo: EventPhoto, index: number): void {
    this.selectedPhoto = photo;
    this.selectedPhotoIndex = index;
  }

  closeLightbox(): void {
    this.selectedPhoto = null;
  }

  nextPhoto(): void {
    if (this.selectedPhotoIndex < this.filteredPhotos.length - 1) {
      this.selectedPhotoIndex++;
      this.selectedPhoto = this.filteredPhotos[this.selectedPhotoIndex];
    }
  }

  previousPhoto(): void {
    if (this.selectedPhotoIndex > 0) {
      this.selectedPhotoIndex--;
      this.selectedPhoto = this.filteredPhotos[this.selectedPhotoIndex];
    }
  }

  goBack(): void {
    this.router.navigate(['/find-photo']);
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.onFaceSearch(file);
    }
  }
}
