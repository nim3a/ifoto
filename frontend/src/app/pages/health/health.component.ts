import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

interface HealthStatus {
  status: string;
  backend: boolean;
  faceService: boolean;
  timestamp: string;
}

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="health-container">
      <div class="content">
        <a routerLink="/" class="back-link">← Back</a>
        
        <h1>System Health</h1>
        <p class="subtitle">Backend connectivity status</p>
        
        <div class="health-checks">
          <div class="check-item" [class.healthy]="backendStatus() === 'healthy'" 
               [class.unhealthy]="backendStatus() === 'unhealthy'"
               [class.checking]="backendStatus() === 'checking'">
            <div class="status-icon">
              {{ backendStatus() === 'healthy' ? '✓' : backendStatus() === 'unhealthy' ? '✗' : '...' }}
            </div>
            <div class="check-info">
              <h3>Backend API</h3>
              <p>{{ backendMessage() }}</p>
            </div>
          </div>
          
          <div class="check-item" [class.healthy]="faceServiceStatus() === 'healthy'" 
               [class.unhealthy]="faceServiceStatus() === 'unhealthy'"
               [class.checking]="faceServiceStatus() === 'checking'">
            <div class="status-icon">
              {{ faceServiceStatus() === 'healthy' ? '✓' : faceServiceStatus() === 'unhealthy' ? '✗' : '...' }}
            </div>
            <div class="check-info">
              <h3>Face Recognition Service</h3>
              <p>{{ faceServiceMessage() }}</p>
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary" (click)="checkHealth()">
          Refresh Status
        </button>
      </div>
    </div>
  `,
  styles: [`
    .health-container {
      min-height: 100vh;
      padding: 2rem;
      background: #ffffff;
    }
    
    .content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .back-link {
      color: #666666;
      text-decoration: none;
      margin-bottom: 2rem;
      display: inline-block;
    }
    
    .back-link:hover {
      color: #000000;
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #000000;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
      color: #666666;
      margin-bottom: 2rem;
    }
    
    .health-checks {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .check-item {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      border: 2px solid #e0e0e0;
      background: #fafafa;
      gap: 1.5rem;
    }
    
    .check-item.checking {
      border-color: #cccccc;
    }
    
    .check-item.healthy {
      border-color: #00cc00;
      background: #f0fff0;
    }
    
    .check-item.unhealthy {
      border-color: #cc0000;
      background: #fff0f0;
    }
    
    .status-icon {
      font-size: 2.5rem;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .check-item.healthy .status-icon {
      color: #00cc00;
    }
    
    .check-item.unhealthy .status-icon {
      color: #cc0000;
    }
    
    .check-item.checking .status-icon {
      color: #cccccc;
    }
    
    .check-info {
      flex: 1;
    }
    
    .check-info h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000000;
      margin-bottom: 0.25rem;
    }
    
    .check-info p {
      color: #666666;
      margin: 0;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      border: 2px solid #000000;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #000000;
      color: #ffffff;
    }
    
    .btn-primary:hover {
      background: #333333;
    }
  `]
})
export class HealthComponent implements OnInit {
  backendStatus = signal<'checking' | 'healthy' | 'unhealthy'>('checking');
  backendMessage = signal('Checking...');
  faceServiceStatus = signal<'checking' | 'healthy' | 'unhealthy'>('checking');
  faceServiceMessage = signal('Checking...');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.checkHealth();
  }

  checkHealth(): void {
    this.backendStatus.set('checking');
    this.backendMessage.set('Checking...');
    this.faceServiceStatus.set('checking');
    this.faceServiceMessage.set('Checking...');

    // Check backend
    // In real app: this.apiService.get<HealthStatus>('/api/health')
    setTimeout(() => {
      // Simulate response
      const isHealthy = Math.random() > 0.3; // 70% chance of success for demo
      this.backendStatus.set(isHealthy ? 'healthy' : 'unhealthy');
      this.backendMessage.set(isHealthy ? 'Connected' : 'Connection failed');
    }, 800);

    // Check face service
    setTimeout(() => {
      const isHealthy = Math.random() > 0.3;
      this.faceServiceStatus.set(isHealthy ? 'healthy' : 'unhealthy');
      this.faceServiceMessage.set(isHealthy ? 'Connected' : 'Connection failed');
    }, 1200);
  }
}
