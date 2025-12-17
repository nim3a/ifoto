import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  
  menuItems = [
    { label: 'خانه', link: '/' },
    { label: 'درباره ما', link: '/about' },
    { label: 'گالری', link: '/gallery' },
    { label: 'پیدا کردن عکس', link: '/find-photo' },
    { label: 'تماس با ما', link: '#contact' }
  ];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
