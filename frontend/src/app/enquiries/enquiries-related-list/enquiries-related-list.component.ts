import { Component, computed, inject, input } from '@angular/core';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { EnquiriesService } from '../enquiries.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiries-related-list',
  templateUrl: './enquiries-related-list.component.html',
  styleUrls: ['./enquiries-related-list.component.css'],
  standalone: false,
})
export class EnquiriesRelatedListComponent {
  private enquiriesService = inject(EnquiriesService);
  private readonly router = inject(Router);
  private readonly enquiries = toSignal<Enquiry[]>(
    this.enquiriesService.enquiries$
  );

  readonly propertyId = input<string>();
  readonly enquiryId = input<string>();

  public relatedEnquiries = computed<Enquiry[]>(() => {
    if (!this.propertyId()) return [];
    return this.enquiries().filter(
      (enq) =>
        enq.property.property_id === this.propertyId() &&
        (!this.enquiryId() || enq.enquiry_id !== this.enquiryId())
    );
  });

  public view(enquiry: Enquiry) {
    this.router.navigate(['/enquiries', enquiry.enquiry_id], {
      replaceUrl: true,
    });
  }
}
