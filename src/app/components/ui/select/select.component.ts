import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() value: string = '';

  @Input() placeholder: string = '';
  @Input() options: { value: string; label: string }[] = [];
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;

  isOpen = false;

  toggleOpen(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectOption(value: string, event: Event): void {
    event.stopPropagation();
    this.value = value;
    this.valueChange.emit(value);
    this.isOpen = false;
  }

  getDisplayValue(): string {
    if (this.value) {
      const option = this.options.find(opt => opt.value === this.value);
      return option ? option.label : this.value;
    }
    return this.placeholder;
  }

  getTriggerClasses(): string {
    return 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer';
  }

  getOptionClasses(value: string): string {
    const base = 'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';
    const selected = this.value === value ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground';
    return `${base} ${selected} cursor-pointer`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && this.trigger && !this.trigger.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
