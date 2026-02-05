import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from '../../services/otp.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-otp-display-page',
  templateUrl: './otp-display-page.component.html',
  styleUrls: ['./otp-display-page.component.scss'],
    standalone: false

})
export class OtpDisplayPageComponent implements OnInit, OnDestroy {
  otp$: Observable<string>;
  timeRemaining$: Observable<number>;
  length$: Observable<number | null>;
  isGenerating$: Observable<boolean>;
  timerPercentage$: Observable<number>;
  isUrgent = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private otpService: OtpService,
    private router: Router
  ) {
    this.otp$ = this.otpService.state$.pipe(map(state => state.otp));
    this.timeRemaining$ = this.otpService.state$.pipe(map(state => state.timeRemaining));
    this.length$ = this.otpService.state$.pipe(map(state => state.length));
    this.isGenerating$ = this.otpService.state$.pipe(map(state => state.isGenerating));
    this.timerPercentage$ = this.timeRemaining$.pipe(
      map(time => (time / 30) * 100)
    );
  }

  ngOnInit(): void {
    // Check if OTP exists, if not redirect to config
    const stateSub = this.otpService.state$.subscribe(state => {
      if (!state.otp && !state.isGenerating && state.isConfigured) {
        this.router.navigate(['/']);
      }

      // Update urgency flag
      this.isUrgent = state.timeRemaining <= 10;
    });

    this.subscription.add(stateSub);
  }

  formatOtp(otpString: string): string {
    if (!otpString) return '';
    if (otpString.length === 6) {
      return `${otpString.slice(0, 3)} ${otpString.slice(3)}`;
    }
    return otpString;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
