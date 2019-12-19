import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTextColor]'
})
export class TextColorDirective {

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {

    this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'red');
  }

}
