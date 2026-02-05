import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AppLayoutComponent } from './components/layout/app-layout/app-layout.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { SelectComponent } from './components/ui/select/select.component';
import { OtpConfigPageComponent } from './pages/otp-config-page/otp-config-page.component';
import { OtpDisplayPageComponent } from './pages/otp-display-page/otp-display-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OtpService } from './services/otp.service';

import { LucideAngularModule, Sparkles, Loader2 } from 'lucide-angular';

const routes: Routes = [
  { path: '', component: OtpConfigPageComponent },
  { path: 'otp', component: OtpDisplayPageComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    OtpConfigPageComponent,
    OtpDisplayPageComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    LucideAngularModule.pick({ Sparkles, Loader2 }),
    AppLayoutComponent,
    ButtonComponent,
    SelectComponent
],
  providers: [OtpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
