import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";

@Component({
  template: `
    <p class="help is-danger" [class.hide]="hide">{{ text }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .hide {
        display: none;
      }
    `
  ]
})
export class ControlErrorComponent implements OnInit {
  private _text;
  hide = true;

  @Input() set text(value) {
    if (value !== this._text) {
      this._text = value;
      this.hide = !value;
      this.cdr.detectChanges();
    }
  }

  get text(): string {
    return this._text;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}
}
