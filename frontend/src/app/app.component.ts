import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {
  title = 'ifoto';
}
