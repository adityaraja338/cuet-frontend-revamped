import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export type NavDirection = 'forward' | 'back';

/**
 * Tracks the perceived direction of the current router navigation so we can
 * drive symmetric enter/leave animations on the router outlet.
 *
 * - Browser back/forward buttons are treated as `back` via `navigationTrigger`.
 * - Programmatic navigations that pass `{ state: { back: true } }` are also
 *   treated as `back` (used by CTA buttons like "Back to home").
 * - Everything else (including the initial load) is `forward`.
 */
@Injectable({ providedIn: 'root' })
export class NavigationDirectionService {
  private _direction: NavDirection = 'forward';

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationStart => event instanceof NavigationStart))
      .subscribe((event) => {
        if (event.navigationTrigger === 'popstate') {
          this._direction = 'back';
          return;
        }

        const state = this.router.getCurrentNavigation()?.extras?.state as
          | { back?: boolean }
          | undefined;

        this._direction = state?.back ? 'back' : 'forward';
      });
  }

  getDirection(): NavDirection {
    return this._direction;
  }
}
