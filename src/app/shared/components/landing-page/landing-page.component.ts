import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


interface FaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

@Component({
  standalone: false,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('landingRoot', { read: ElementRef })
  landingRoot?: ElementRef<HTMLElement>;

  private previousRootClasses: string | null = null;
  private removeScrollListeners?: () => void;
  private rafId = 0;
  private reducedMotion = false;
  private initScrollHandle = 0;

  readonly isScrolled = signal(false);
  readonly activeChapter = signal<string>('hero');
  readonly mobileMenuOpen = signal(false);
  readonly currentYear = new Date().getFullYear();

  /** 
   * Stores progress (0 to 1) for each chapter.
   */
  readonly chapterProgress = signal<Record<string, number>>({
    hero: 1,
    destination: 0,
    mentor: 0,
    exhibits: 0,
    'field-guide': 0
  });

  readonly levers: ReadonlyArray<{ icon: string; title: string; description: string }> = [
    { icon: 'target', title: 'Curated Focus', description: 'Stop wasting time on everything. We show you the exact topics that matter most for CUET and getting into JNU.' },
    { icon: 'speed', title: 'Velocity Drills', description: 'Speed is half the battle. Practice sets that train you to solve faster, not just smarter.' },
    { icon: 'analytics', title: 'Precision Gaps', description: 'Know exactly what you got wrong and why. Fix the gap before exam day, not after.' },
    { icon: 'psychology', title: 'Mental Calm', description: 'Preparation is also about mindset. Build the focus and steadiness to perform when it counts.' },
  ];

  readonly platformPillars: ReadonlyArray<{
    readonly icon: string;
    readonly title: string;
    readonly copy: string;
  }> = [
    {
      icon: 'login',
      title: 'Secure login & dashboard',
      copy: 'One sign-in unlocks your batches, upcoming live tests, recent scores, and shortcuts to every study tool.',
    },
    {
      icon: 'groups',
      title: 'Batch enrolment',
      copy: 'Join elite cohorts mentored by those who have already conquered the summit.',
    },
    {
      icon: 'bolt',
      title: 'Live tests',
      copy: 'Real-time proctored assessments to simulate exam-day stakes.',
    },
    {
      icon: 'quiz',
      title: 'Practice & mock tests',
      copy: 'Topic-wise drills and full-length mocks with deep analytical feedback.',
    },
    {
      icon: 'menu_book',
      title: 'Study material',
      copy: 'Curated materials and daily newspapers to sharpen your comprehension.',
    },
    {
      icon: 'smart_display',
      title: 'Recorded lectures',
      copy: 'Rewatch classes on your schedule — perfect for revision and catching up.',
    },
  ];

  readonly stats: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
  }> = [
    { value: '80+', label: 'Students at JNU' },
    { value: '5000+', label: 'Tests Taken' },
    { value: '24/7', label: 'Support Available' },
  ];

  readonly faqs: ReadonlyArray<{ id: string; question: string; answer: string }> = [
    {
      id: 'what-is',
      question: 'What is CUET Corner?',
      answer: 'Your complete prep workspace for CUET — batches, live tests, practice tests, study material, daily newspapers, and recorded lectures, all behind one secure login.',
    },
    {
      id: 'device',
      question: 'Does it work on my phone?',
      answer: 'Yes. Everything — tests, materials, lectures, your dashboard — is built to work comfortably on any smartphone.',
    },
    {
      id: 'batches',
      question: 'How do batches work?',
      answer: 'Join a batch to get guided preparation: scheduled tests, curated study material, and structured access to everything you need for your subjects.',
    },
    {
      id: 'who',
      question: 'Who made CUET Corner?',
      answer: 'Abhinav Harsh, a CUET qualifier now studying at JNU. He built the system he wished existed when he was preparing.',
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = document.documentElement;
    this.previousRootClasses = root.className;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScrollHandle = window.setTimeout(() => {
      this.initScrollHandle = 0;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.bindScrollEvents();
    }, 0);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initScrollHandle) window.clearTimeout(this.initScrollHandle);
    this.removeScrollListeners?.();
    if (this.rafId) window.cancelAnimationFrame(this.rafId);
    if (this.previousRootClasses !== null) {
      document.documentElement.className = this.previousRootClasses;
    }
  }

  navigateToExhibit(target: string): void {
    if (this.hasAccessToken()) {
      this.router.navigate(['/student', target]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.mobileMenuOpen.set(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  hasAccessToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return !!window.localStorage.getItem('cuet_access_token');
    } catch {
      return false;
    }
  }

  clamp(min: number, val: number, max: number): number {
    return Math.max(min, Math.min(val, max));
  }

  private bindScrollEvents(): void {
    const onScroll = () => {
      if (this.rafId) return;
      this.rafId = window.requestAnimationFrame(() => {
        this.rafId = 0;
        this.updateScrollMetrics();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.removeScrollListeners = () => window.removeEventListener('scroll', onScroll);
    this.updateScrollMetrics();
  }

  private updateScrollMetrics(): void {
    const scrollY = window.scrollY;
    this.isScrolled.set(scrollY > 50);

    const viewportHeight = window.innerHeight;
    const chapters = ['hero', 'destination', 'mentor', 'exhibits', 'field-guide'];
    const newProgress: Record<string, number> = {};

    let dominantChapter = 'hero';
    let minDistance = Infinity;

    chapters.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      
      // Refined Progress: 0 (bottom of viewport) to 1 (top of viewport)
      // We want to track the element as it moves through the viewport.
      const entry = rect.top - viewportHeight; // Negative when in view
      const exit = rect.bottom; // Positive when in view
      
      // Calculate 0-1 progress specifically for the viewport transit
      // 0: top of element is at bottom of viewport
      // 1: bottom of element is at top of viewport
      const totalDistance = viewportHeight + rect.height;
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / totalDistance));
      
      newProgress[id] = progress;

      // Dominant chapter logic (using center-point focus)
      const centerY = rect.top + (rect.height / 2);
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = Math.abs(centerY - viewportCenter);
      
      if (distanceFromCenter < minDistance) {
        minDistance = distanceFromCenter;
        dominantChapter = id;
      }
    });

    this.chapterProgress.set(newProgress);
    this.activeChapter.set(dominantChapter);
  }
}
