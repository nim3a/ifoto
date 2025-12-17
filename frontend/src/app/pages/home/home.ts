import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  
  // Stats data
  stats = [
    { value: '+500,000', label: 'عکس آپلود شده' },
    { value: '+50', label: 'رویداد برگزار شده' },
    { value: '+30', label: 'عکاس همکار' }
  ];

  // Features data
  features = [
    {
      icon: '/assets/icon-storage.svg',
      title: 'آپلود',
      description: 'آپلود آسان عکس‌های رویداد'
    },
    {
      icon: '/assets/icon-storage.svg',
      title: 'مدیریت',
      description: 'مدیریت حرفه‌ای عکس‌ها'
    },
    {
      icon: '/assets/icon-search.svg',
      title: 'تشخیص چهره',
      description: 'جستجوی هوشمند با چهره'
    }
  ];

  // Social links
  socialLinks = [
    { icon: 'facebook', url: '#' },
    { icon: 'instagram', url: '#' },
    { icon: 'youtube', url: '#' }
  ];

  constructor() {}

}
