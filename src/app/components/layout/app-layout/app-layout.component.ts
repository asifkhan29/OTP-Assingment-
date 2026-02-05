import { Component, Input } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-app-layout',
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  imports: [NavbarComponent, FooterComponent]
})
export class AppLayoutComponent {
  @Input() showBackground = false;
}
