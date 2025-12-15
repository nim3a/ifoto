import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PhotoService, GalleryPhoto } from '../../core/services/photo.service';

@Component({
  selector: 'app-event-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.scss']
})
export class EventGalleryComponent implements OnInit {
  eventId: number | null = null;
  photos: GalleryPhoto[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('eventId');
      if (id) {
        this.eventId = parseInt(id, 10);
        this.loadPhotos();
      }
    });
  }

  loadPhotos(): void {
    if (!this.eventId) return;

    this.loading = true;
    this.error = null;

    this.photoService.getEventPhotos(this.eventId).subscribe({
      next: (photos) => {
        this.photos = photos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load photos:', err);
        this.error = 'فشل في تحميل الصور. يرجى المحاولة مرة أخرى.';
        this.loading = false;
      }
    });
  }

  navigateToSearch(): void {
    if (this.eventId) {
      this.router.navigate(['/search', this.eventId]);
    }
  }

  getPhotoUrl(storagePath: string): string {
    return `${storagePath}`;
  }
}
