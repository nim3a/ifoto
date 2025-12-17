import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryDetail, Photo } from '../../core/models/gallery.model';

@Component({
  selector: 'app-gallery-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.scss']
})
export class GalleryDetailComponent implements OnInit {
  gallery: GalleryDetail | null = null;
  isLoading = true;
  error: string | null = null;
  selectedPhoto: Photo | null = null;
  selectedPhotoIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadGallery(id);
      }
    });
  }

  loadGallery(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.galleryService.getGalleryById(id).subscribe({
      next: (gallery: GalleryDetail) => {
        this.gallery = gallery;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری گالری. لطفاً دوباره تلاش کنید.';
        this.isLoading = false;
        console.error('Error loading gallery:', err);
      }
    });
  }

  openLightbox(photo: Photo, index: number): void {
    this.selectedPhoto = photo;
    this.selectedPhotoIndex = index;
  }

  closeLightbox(): void {
    this.selectedPhoto = null;
  }

  nextPhoto(): void {
    if (this.gallery && this.selectedPhotoIndex < this.gallery.photos.length - 1) {
      this.selectedPhotoIndex++;
      this.selectedPhoto = this.gallery.photos[this.selectedPhotoIndex];
    }
  }

  previousPhoto(): void {
    if (this.selectedPhotoIndex > 0) {
      this.selectedPhotoIndex--;
      this.selectedPhoto = this.gallery!.photos[this.selectedPhotoIndex];
    }
  }

  goBack(): void {
    this.router.navigate(['/gallery']);
  }
}
