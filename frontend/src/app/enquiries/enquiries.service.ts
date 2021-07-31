import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Enquiry } from '../shared/interface/enquiries';

@Injectable({
  providedIn: 'root'
})
export class EnquiriesService {

  public readonly enquiries$: Observable<Enquiry[]>;
  public readonly enquiry$: Observable<Enquiry>;
  private readonly enquiriesSub = new BehaviorSubject<Enquiry[]>([]);
  private readonly enquirySub = new BehaviorSubject<Enquiry>(null);

  constructor() {
    this.enquiries$ = this.enquiriesSub.asObservable();
    this.enquiry$ = this.enquirySub.asObservable();
  }

  public get enquiries(): Enquiry[] {
    return this.enquiriesSub.getValue();
  }

  public set enquiries(enquiries: Enquiry[]) {
    this.enquiriesSub.next(enquiries);
  }

  public get enquiry(): Enquiry | null {
    return this.enquirySub.getValue();
  }

  public set enquiry(enquiry: Enquiry) {
    this.enquirySub.next(enquiry);
  }

  public removeEnquiry(enqId: string) {
    this.enquiries = this.enquiries.filter(enquiry => enquiry.enqId !== enqId);
  }
}
