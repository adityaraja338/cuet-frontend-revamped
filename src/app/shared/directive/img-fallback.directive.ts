import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img[imgFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  @Input() imgFallback: string | undefined;

  constructor(private eRef: ElementRef) {}

  @HostListener('error')
  loadFallbackImage() {
    const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;
    element.src =
      this.imgFallback ||
      'https://img.icons8.com/?size=100&id=37814&format=png&color=FFFFFF';
  }
}
