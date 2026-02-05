import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OtpState {
  otp: string;
  timeRemaining: number;
  length: 3 | 6 | null;
  isGenerating: boolean;
  isConfigured: boolean;
}

@Injectable({ providedIn: 'root' })
export class OtpService {

  private readonly API_URL =
    'https://otp-generator-bkbr.onrender.com/api/otp/generate';

  private eventSource?: EventSource;
  private timer?: number;

  private stateSubject = new BehaviorSubject<OtpState>({
    otp: '',
    timeRemaining: 0,
    length: null,
    isGenerating: false,
    isConfigured: false
  });

  state$ = this.stateSubject.asObservable();

  constructor(private zone: NgZone) {}


  setLength(length: 3 | 6): void {
    this.patch({
      length,
      isConfigured: true
    });
  }



  async generateOtp(): Promise<void> {
    const { length } = this.stateSubject.value;
    if (!length) return;

    this.cleanup();

    this.patch({
      isGenerating: true,
      otp: '',
      timeRemaining: 0
    });

    this.eventSource = new EventSource(
      `${this.API_URL}?digits=${length}`
    );

    this.eventSource.addEventListener('otp', (event: MessageEvent) => {
      this.zone.run(() => {
        const data = JSON.parse(event.data);

        this.patch({
          otp: data.otp,
          isGenerating: false,
          timeRemaining: data.validForSeconds ?? 30
        });

        this.startTimer();
      });
    });

    this.eventSource.onerror = () => {
      this.zone.run(() => this.cleanup());
    };
  }


  private startTimer(): void {
    this.clearTimer();

    this.timer = window.setInterval(() => {
      const state = this.stateSubject.value;

      if (state.timeRemaining <= 1) {
        // backend will push new OTP, just wait
        this.patch({ timeRemaining: 0 });
        this.clearTimer();
        return;
      }

      this.patch({
        timeRemaining: state.timeRemaining - 1
      });
    }, 1000);
  }


  private patch(partial: Partial<OtpState>) {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partial
    });
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private cleanup(): void {
    this.eventSource?.close();
    this.eventSource = undefined;
    this.clearTimer();
  }
}
