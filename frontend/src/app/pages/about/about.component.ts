import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  
  // Values/Core principles
  values = [
    {
      icon: '/assets/icon-innovation.svg',
      title: 'نوآوری',
      description: 'ما دائماً در حال نوآوری هستیم تا بهترین ویژگی‌ها و فناوری‌های پیشرفته را ارائه دهیم.'
    },
    {
      icon: '/assets/icon-user-centric.svg',
      title: 'کاربرمحوری',
      description: 'رضایت و نیازهای کاربران در مرکز تمام تصمیمات ما قرار دارد.'
    },
    {
      icon: '/assets/icon-security.svg',
      title: 'امنیت',
      description: 'ما متعهد به حفاظت از داده‌های کاربران با بالاترین استانداردهای امنیتی هستیم.'
    },
    {
      icon: '/assets/icon-excellence.svg',
      title: 'تعالی',
      description: 'ما تلاش می‌کنیم در هر جنبه از خدمات خود به بالاترین کیفیت دست یابیم.'
    }
  ];

  constructor() {}

}
