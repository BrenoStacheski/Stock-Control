import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent {

  constructor(
    private cookieService: CookieService,
    private router: Router
    ) {}

    handleLogout(): void {
      this.cookieService.delete('USER_INFO');
      void this.router.navigate(['/home']);
    }
}
