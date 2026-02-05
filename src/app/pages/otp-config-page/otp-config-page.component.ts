import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from '../../services/otp.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from '../../components/layout/app-layout/app-layout.component'; // ✅ इसको import किया है
import { SelectComponent } from '../../components/ui/select/select.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-otp-config-page',
  standalone: false,

  templateUrl: './otp-config-page.component.html',
  styleUrls: ['./otp-config-page.component.scss']
})
export class OtpConfigPageComponent implements OnInit {
  selectedLength = '';
  isGenerating$: Observable<boolean>;
  isValid = false;

  constructor(
    private otpService: OtpService,
    private router: Router
  ) {
    this.isGenerating$ = this.otpService.state$.pipe(
      map(state => state.isGenerating)
    );
  }

  ngOnInit(): void {
    // Check if already configured
    this.otpService.state$.subscribe(state => {
      if (state.length) {
        this.selectedLength = state.length.toString();
        this.isValid = true;
      }
    });
  }

  onLengthChange(value: string): void {
    this.selectedLength = value;
    this.isValid = true;
    this.otpService.setLength(parseInt(value) as 3 | 6);
  }

  async generateOtp(): Promise<void> {
    if (!this.isValid) return;

    await this.otpService.generateOtp();
    this.router.navigate(['/otp']);
  }
}
