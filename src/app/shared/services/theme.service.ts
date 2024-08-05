import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeLinkElement: HTMLLinkElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public changeTheme(themePath: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.currentThemeLinkElement) {
        document.head.removeChild(this.currentThemeLinkElement);
      }

      this.currentThemeLinkElement = document.createElement('link');
      this.currentThemeLinkElement.rel = 'stylesheet/less';
      this.currentThemeLinkElement.type = 'text/css';
      this.currentThemeLinkElement.href = themePath;
      document.head.appendChild(this.currentThemeLinkElement);

      // Assuming Less.js is included in the project
      (window as any).less.modifyVars({});
    }
  }
}