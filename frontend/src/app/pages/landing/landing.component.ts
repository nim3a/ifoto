import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing-container">
      <div class="content">
        <h1>ifoto</h1>
        <p class="subtitle">Event Photography & Face Recognition</p>
        
        <div class="features">
          <div class="feature">
            <h3>Upload Photos</h3>
            <p>Upload your event photos to our platform</p>
          </div>
          <div class="feature">
            <h3>Face Search</h3>
            <p>Find your photos using face recognition</p>
          </div>
          <div class="feature">
            <h3>Fast & Secure</h3>
            <p>Professional B2B solution for event photography</p>
          </div>
        </div>
        
        <div class="actions">
          <a routerLink="/upload" class="btn btn-primary">Upload Photos</a>
          <a routerLink="/search" class="btn btn-secondary">Find My Photos</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      padding: 20px;
    }
    
    .content {
      max-width: 900px;
      width: 100%;
      text-align: center;
    }
    
    h1 {
      font-size: 4rem;
      font-weight: 700;
      color: #000000;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.5rem;
      color: #666666;
      margin-bottom: 3rem;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .feature {
      padding: 2rem;
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
    }
    
    .feature h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000000;
      margin-bottom: 0.5rem;
    }
    
    .feature p {
      color: #666666;
      line-height: 1.6;
    }
    
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      border: 2px solid #000000;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-block;
    }
    
    .btn-primary {
      background: #000000;
      color: #ffffff;
    }
    
    .btn-primary:hover {
      background: #333333;
    }
    
    .btn-secondary {
      background: #ffffff;
      color: #000000;
    }
    
    .btn-secondary:hover {
      background: #f0f0f0;
    }
  `]
})
export class LandingComponent {}
