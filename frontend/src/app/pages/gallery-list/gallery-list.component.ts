import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { GalleryService } from '../../core/services/gallery.service';
import { Gallery, PaginatedGalleries } from '../../core/models/gallery.model';

@Component({
  selector: 'app-gallery-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss']
})
export class GalleryListComponent implements OnInit {
  galleries: Gallery[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadGalleries();
  }

  loadGalleries(): void {
    this.isLoading = true;
    this.error = null;

    this.galleryService.getGalleries(this.currentPage).subscribe({
      next: (response: PaginatedGalleries) => {
        this.galleries = response.items;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری گالری‌ها. لطفاً دوباره تلاش کنید.';
        this.isLoading = false;
        console.error('Error loading galleries:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadGalleries();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
