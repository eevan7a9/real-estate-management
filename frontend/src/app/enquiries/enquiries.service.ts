import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
import { Enquiry } from '../shared/interface/enquiry';
import { Property } from '../shared/interface/property';
import { headerDict } from '../shared/utility';
import { UserService } from '../user/user.service';

const enquiryUrl = environment.api.url + 'enquiries';
const requestOptions = (token = '', body = {},) => ({
  headers: new HttpHeaders(headerDict({ token })),
  body
});

interface ResEnquiry extends ApiResponse {
  data: Enquiry;
}

interface ResEnquiries extends ApiResponse {
  data: Enquiry[];
}

@Injectable({
  providedIn: 'root'
})
export class EnquiriesService {

  public readonly enquiries$: Observable<Enquiry[]>;
  public readonly enquiry$: Observable<Enquiry>;
  private readonly enquiriesSub = new BehaviorSubject<Enquiry[]>([]);
  private readonly enquirySub = new BehaviorSubject<Enquiry>(null);

  constructor(private http: HttpClient, private userService: UserService) {
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

  public async fetchEnquiries(): Promise<void> {
    try {
      this.enquiries = (await this.http.get<ResEnquiries>(enquiryUrl).toPromise()).data;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async addEnquiry(enquiry: Enquiry, property: Partial<Property>): Promise<ResEnquiry> {
    const token = this.userService.token();
    const formData = enquiry;
    formData.property = {
      name: property.name,
      id: property.property_id
    };
    formData.user = {
      from: this.userService.user?.user_id,
      to: property.user_id
    };
    try {
      const res = await this.http.post<ResEnquiry>(enquiryUrl, formData, requestOptions(token))
        .toPromise();
      this.enquiries = [...this.enquiries, res.data];
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public removeEnquiry(enqId: string) {
    this.enquiries = this.enquiries.filter(enquiry => enquiry.id !== enqId);
  }
}
