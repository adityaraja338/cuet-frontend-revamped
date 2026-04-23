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

/**
 * CSS variables written on the landing root during scroll. They are inherited
 * by every descendant element, so children can opt into parallax purely via
 * CSS (`transform: translate3d(0, var(--parallax-mid), 0)` etc.) without JS.
 *
 * Important: these vars live ONLY on #landing-page (the outer host). Do NOT
 * shadow them with `--parallax-*: 0px` defaults on inner wrappers like
 * `.landing-hero`, or children will resolve against those defaults and the
 * parallax will appear broken.
 */
const PARALLAX_VARS = [
  '--parallax-slow',
  '--parallax-mid',
  '--parallax-fast',
  '--parallax-fg',
  '--parallax-rise',
  '--parallax-drift',
] as const;

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

  readonly mobileMenuOpen = signal(false);
  readonly openFaqId = signal<string | null>('what-is');
  readonly currentYear = new Date().getFullYear();

  readonly platformPillars: ReadonlyArray<{
    readonly icon: string;
    readonly title: string;
    readonly copy: string;
    readonly tag: string;
    readonly span?: 'wide' | 'half';
  }> = [
    {
      icon: 'login',
      title: 'Secure login & personal dashboard',
      copy: 'One sign-in unlocks your batches, upcoming live tests, recent scores, and shortcuts to every study tool.',
      tag: 'Your hub',
      span: 'wide',
    },
    {
      icon: 'groups',
      title: 'Batch enrolment',
      copy: 'Join the cohort that matches your timeline. Schedules, announcements, and cohort-specific resources stay grouped cleanly per batch.',
      tag: 'Cohorts',
    },
    {
      icon: 'bolt',
      title: 'Live tests',
      copy: 'Attempt proctored live assessments alongside peers with real-time rank context so exam pressure never surprises you.',
      tag: 'Live',
    },
    {
      icon: 'quiz',
      title: 'Practice & mock tests',
      copy: 'Drill topic-wise sets and full-length mocks with instant feedback and analytics that point at the gaps worth closing next.',
      tag: 'Practice',
      span: 'wide',
    },
    {
      icon: 'menu_book',
      title: 'Study material & daily newspapers',
      copy: 'Curated notes alongside a reading-room of articles sharpen language, comprehension, and general awareness every day.',
      tag: 'Reading room',
      span: 'half',
    },
    {
      icon: 'smart_display',
      title: 'Recorded lectures',
      copy: 'Rewatch classes on your schedule — perfect for revision and catching up between live tests without missing a beat.',
      tag: 'On demand',
      span: 'half',
    },
  ];

  readonly howItWorks: ReadonlyArray<{
    readonly step: string;
    readonly title: string;
    readonly copy: string;
    readonly icon: string;
  }> = [
    {
      step: '01',
      title: 'Create your account',
      copy: 'Sign up in under a minute. Your dashboard is ready before you finish your first sip of chai.',
      icon: 'person_add',
    },
    {
      step: '02',
      title: 'Enrol in the right batch',
      copy: 'Pick a cohort that matches your target window. Schedules, mentors, and content fall into place.',
      icon: 'playlist_add_check',
    },
    {
      step: '03',
      title: 'Practice, test, rewatch',
      copy: 'Run daily drills, join live tests, and revisit recordings. Analytics tells you what to fix next.',
      icon: 'workspace_premium',
    },
  ];

  readonly stats: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
    readonly icon: string;
  }> = [
    { value: '40+', label: 'Students placed in EFLU', icon: 'school' },
    { value: '40+', label: 'Students placed at JNU', icon: 'account_balance' },
    { value: '50+', label: 'Mock & topic-wise tests', icon: 'assignment_turned_in' },
    { value: '24/7', label: 'Recorded lecture library', icon: 'video_library' },
  ];

  readonly faqs: ReadonlyArray<FaqEntry> = [
    {
      id: 'what-is',
      question: 'What exactly is CUET Corner?',
      answer:
        'A single student workspace for CUET aspirants — batches, live tests, practice and mocks, study material, daily newspapers, and recorded lectures, all behind one secure login.',
    },
    {
      id: 'who-for',
      question: 'Who is it for?',
      answer:
        'Serious CUET aspirants who want structure: students preparing from scratch, repeaters tightening weak spots, and anyone who prefers one flow instead of juggling five apps.',
    },
    {
      id: 'how-tests',
      question: 'How do live vs mock tests differ?',
      answer:
        'Live tests run at fixed windows with peer rankings and exam-day pressure. Mocks and topic drills are on-demand with instant feedback and analytics you can revisit any time.',
    },
    {
      id: 'materials',
      question: 'What is inside the study material?',
      answer:
        'Mentor-curated notes by subject, plus a daily reading room of newspapers and articles focused on language, comprehension, and general awareness.',
    },
    {
      id: 'device',
      question: 'Can I use it on mobile?',
      answer:
        'Yes. The dashboard, tests, materials, and recordings are all built to work comfortably on phone, tablet, and desktop.',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = document.documentElement;
    this.previousRootClasses = root.className;
    root.classList.remove('dark');
    if (!root.classList.contains('light')) root.classList.add('light');
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Defer one tick so ViewChild is resolved and the first paint has happened.
    this.initScrollHandle = window.setTimeout(() => {
      this.initScrollHandle = 0;
      const docRoot = document.documentElement;
      docRoot.classList.remove('dark');
      docRoot.classList.add('light');

      this.reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      this.bindParallaxScroll();
    }, 0);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initScrollHandle) {
      window.clearTimeout(this.initScrollHandle);
      this.initScrollHandle = 0;
    }
    this.removeScrollListeners?.();
    this.removeScrollListeners = undefined;
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    this.clearParallaxStyles();
    if (this.previousRootClasses === null) return;
    document.documentElement.className = this.previousRootClasses;
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.mobileMenuOpen.set(false);
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  toggleFaq(id: string): void {
    this.openFaqId.update((current) => (current === id ? null : id));
  }

  hasAccessToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return !!window.localStorage.getItem('cuet_access_token');
    } catch {
      return false;
    }
  }

  /** Host element that owns the parallax CSS variables. */
  private landingHost(): HTMLElement | null {
    return (
      this.landingRoot?.nativeElement ??
      document.getElementById('landing-page')
    );
  }

  private getScrollY(): number {
    const se = document.scrollingElement;
    const fromDoc = se?.scrollTop ?? 0;
    const fromWin = window.scrollY ?? window.pageYOffset ?? 0;
    const fromBody = document.body?.scrollTop ?? 0;
    return Math.max(fromDoc, fromWin, fromBody);
  }

  private clearParallaxStyles(): void {
    const el = this.landingHost();
    if (!el) return;
    for (const v of PARALLAX_VARS) {
      el.style.removeProperty(v);
    }
  }

  private applyParallax(): void {
    const el = this.landingHost();
    if (!el) return;

    if (this.reducedMotion) {
      this.clearParallaxStyles();
      return;
    }

    const y = this.getScrollY();
    // Tuned to give visible depth at normal reading scroll speeds without
    // ripping layers off the page at deep scroll.
    el.style.setProperty('--parallax-slow', `${y * 0.2}px`);
    el.style.setProperty('--parallax-mid', `${y * 0.4}px`);
    el.style.setProperty('--parallax-fast', `${y * 0.68}px`);
    el.style.setProperty('--parallax-fg', `${-y * 0.09}px`);
    el.style.setProperty('--parallax-rise', `${y * 0.16}px`);
    el.style.setProperty('--parallax-drift', `${y * 0.05}px`);
  }

  private bindParallaxScroll(): void {
    const onScroll = () => {
      if (this.rafId) return;
      this.rafId = window.requestAnimationFrame(() => {
        this.rafId = 0;
        this.applyParallax();
      });
    };

    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener('scroll', onScroll, opts);
    document.addEventListener('scroll', onScroll, opts);
    document.documentElement.addEventListener('scroll', onScroll, opts);
    document.body.addEventListener('scroll', onScroll, opts);

    const vv = window.visualViewport;
    vv?.addEventListener('scroll', onScroll, { passive: true });

    const host = this.landingHost();
    host?.addEventListener('scroll', onScroll, { passive: true });

    this.removeScrollListeners = () => {
      window.removeEventListener('scroll', onScroll, opts);
      document.removeEventListener('scroll', onScroll, opts);
      document.documentElement.removeEventListener('scroll', onScroll, opts);
      document.body.removeEventListener('scroll', onScroll, opts);
      vv?.removeEventListener('scroll', onScroll);
      host?.removeEventListener('scroll', onScroll);
    };

    onScroll();
  }
}
