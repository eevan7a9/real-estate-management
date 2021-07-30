import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Enquiry } from '../shared/interface/enquiries';

@Injectable({
  providedIn: 'root'
})
export class EnquiriesService {

  public readonly enquiries$: Observable<Enquiry[]>;
  private readonly enquiriesSub = new BehaviorSubject<Enquiry[]>([]);

  constructor() {
    this.enquiries$ = this.enquiriesSub.asObservable();
  }

  public get enquiries(): Enquiry[] {
    return this.enquiriesSub.getValue();
  }

  public set enquiries(property: Enquiry[]) {
    this.enquiriesSub.next(property);
  }
}
