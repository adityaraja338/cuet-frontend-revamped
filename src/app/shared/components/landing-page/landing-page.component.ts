import { Component, HostListener, OnInit } from '@angular/core';
// import { debounce } from 'lodash';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  showHeader = true;
  activeSection = 'home'; // Track the active section
  private lastScrollTop = 0;

  constructor() {
    // console.log('constructor');
    // this.onScroll = debounce(this.onScroll.bind(this), 100);
  }

  ngOnInit() {
    // console.log('ngOnint');
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // Show/hide header based on scroll direction
    if (st > this.lastScrollTop) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }

    // Update the active section based on the scroll position
    this.updateActiveSection();

    this.lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
  }

  // Method to update active section based on scroll position
  updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const threshold = window.innerHeight / 3; // Used to calculate when a section is in view

    sections.forEach((section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom >= threshold) {
        this.activeSection = section.id;
      }
    });
  }

  // Method to scroll to a specific section smoothly
  scrollToSection(sectionId: string, event: MouseEvent) {
    event.preventDefault(); // Prevent the default jump to the section

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }
}
