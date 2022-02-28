import {
  Directive,
  Optional,
  Inject,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  Host,
  OnDestroy,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FORM_ERRORS } from './form-errors';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { FormSubmitDirective } from './form-submit.directive';
import { merge, EMPTY, Observable, takeUntil, Subject } from 'rxjs';
import { ControlErrorComponent } from './control-error/control-error.component';

@Directive({
  selector: '[formControl], [formControlName]',
})
export class ControlErrorsDirective implements OnDestroy {
  ref!: ComponentRef<ControlErrorComponent>;
  container: ViewContainerRef;
  submit$: Observable<Event>;
  @Input() customErrors: any = {};

  private _destory = new Subject<void>();

  constructor(
    private resolver: ComponentFactoryResolver,
    @Optional() controlErrorContainer: ControlErrorContainerDirective,
    @Inject(FORM_ERRORS) private errors: any,
    @Optional() @Host() private form: FormSubmitDirective,
    private controlDir: NgControl,
    vcr: ViewContainerRef
  ) {
    this.container = controlErrorContainer ? controlErrorContainer.vcr : vcr;
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
  }

  ngOnInit() {
    merge(this.submit$, this.control!.valueChanges)
      .pipe(takeUntil(this._destory))
      .subscribe(() => {
        const controlErrors = this.control?.errors;
        if (controlErrors) {
          const firstKey = Object.keys(controlErrors)[0];
          const getError = this.errors[firstKey];
          const text =
            this.customErrors[firstKey] || getError(controlErrors[firstKey]);
          this.setError(text);
        } else if (this.ref) {
          this.setError('');
        }
      });
  }

  get control() {
    return this.controlDir.control;
  }

  setError(text: string) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(
        ControlErrorComponent
      );
      this.ref = this.container.createComponent(factory);
    }

    this.ref.instance.text = text;
  }

  ngOnDestroy() {
    this._destory.next();
    this._destory.complete();
  }
}
