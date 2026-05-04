import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { NzImageModule } from 'ng-zorro-antd/image';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NzImageModule],
      declarations: [LandingPageComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    try {
      window.localStorage.removeItem('cuet_access_token');
    } catch {
      /* non-browser environments */
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the hero headline', () => {
    const host: HTMLElement = fixture.nativeElement;
    const headline = host.querySelector('.landing-hero__headline');
    expect(headline?.textContent?.toLowerCase()).toContain('the struggle');
  });

  it('exposes platform pillars covering every core capability', () => {
    const tags = component.platformPillars.map((p) =>
      p.title.toLowerCase(),
    );
    expect(tags.some((t) => t.includes('login'))).toBeTrue();
    expect(tags.some((t) => t.includes('batch'))).toBeTrue();
    expect(tags.some((t) => t.includes('live'))).toBeTrue();
    expect(tags.some((t) => t.includes('practice'))).toBeTrue();
    expect(tags.some((t) => t.includes('material'))).toBeTrue();
    expect(tags.some((t) => t.includes('recorded'))).toBeTrue();
  });

  it('toggles the mobile menu signal', () => {
    expect(component.mobileMenuOpen()).toBeFalse();
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeTrue();
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeFalse();
  });

  it('opens and closes FAQ items', () => {
    const firstId = component.faqs[0].id;
    component.toggleFaq(firstId);
    expect(component.openFaqId()).toBeNull();
    component.toggleFaq(firstId);
    expect(component.openFaqId()).toBe(firstId);
  });

  it('reports no access token when localStorage is empty', () => {
    try {
      window.localStorage.removeItem('cuet_access_token');
    } catch {
      /* non-browser */
    }
    expect(component.hasAccessToken()).toBeFalse();
  });
});
