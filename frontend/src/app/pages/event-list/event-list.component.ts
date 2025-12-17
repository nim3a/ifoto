import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { EventService } from '../../core/services/event.service';
import { Event, PaginatedEvents } from '../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  searchQuery = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.error = null;

    const request = this.searchQuery 
      ? this.eventService.searchEvents(this.searchQuery, this.currentPage)
      : this.eventService.getEvents(this.currentPage);

    request.subscribe({
      next: (response: PaginatedEvents) => {
        this.events = response.items;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'خطا در بارگذاری رویدادها. لطفاً دوباره تلاش کنید.';
        this.isLoading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadEvents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
