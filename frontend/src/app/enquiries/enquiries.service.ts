import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
import { Enquiry, EnquiryCreate } from '../shared/interface/enquiry';
import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { requestOptions } from '../shared/utility/requests';

const enquiryUrl = environment.api.server + 'enquiries';

@Injectable({
  providedIn: 'root',
})
export class EnquiriesService {
  public initialFetchDone = signal<boolean>(false);
  public readonly enquiries$: Observable<Enquiry[]>;
  public readonly enquiry$: Observable<Enquiry | null>;
  private readonly enquiriesSub = new BehaviorSubject<Enquiry[]>([]);
  private readonly enquirySub = new BehaviorSubject<Enquiry | null>(null);

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.enquiries$ = this.enquiriesSub.asObservable();
    this.enquiry$ = this.enquirySub.asObservable();
  }

  public get enquiries(): Enquiry[] {
    return this.enquiriesSub.getValue();
  }

  public set enquiries(enquiries: Enquiry[]) {
    this.enquiriesSub.next(enquiries);
  }

  public fetchEnquiries(): Observable<ApiResponse<Enquiry[]>> {
    return this.http.get<ApiResponse<Enquiry[]>>(
      enquiryUrl,
      requestOptions({ token: this.userService.token }),
    );
  }

  public fetchEnquiry(enqId: string): Observable<ApiResponse<Enquiry>> {
    return this.http.get<ApiResponse<Enquiry>>(
      enquiryUrl + '/' + enqId,
      requestOptions({ token: this.userService.token }),
    );
  }

  public createEnquiry(
    enquiry: EnquiryCreate,
    property: Partial<Property>,
  ): Observable<ApiResponse<Enquiry>> {
    const token = this.userService.token;
    const formData = {
      ...enquiry,
      property: {
        property_id: property.property_id,
        name: property.name,
      },
    };
    return this.http.post<ApiResponse<Enquiry>>(
      enquiryUrl,
      formData,
      requestOptions({ token }),
    );
  }

  public removeEnquiry(enqId: string): Observable<ApiResponse | undefined> {
    const token = this.userService.token;
    const url = enquiryUrl + '/' + enqId;
    return this.http.delete<ApiResponse>(url, requestOptions({ token }));
  }

  public readEnquiry(
    enqId: string,
  ): Observable<ApiResponse<Enquiry> | undefined> {
    const token = this.userService.token;
    const url = enquiryUrl + '/' + enqId;
    return this.http.patch<ApiResponse<Enquiry>>(
      url,
      { read: true },
      requestOptions({ token }),
    );
  }

  public updateEnquiriesState(enquiry: Enquiry): void {
    this.enquiries = this.enquiries.map((enq) =>
      enq.enquiry_id === enquiry.enquiry_id ? enquiry : enq,
    );
  }

  public resetState(): void {
    this.enquiries = [];
    this.initialFetchDone.set(false);
  }

  public insertEnquiryToState(enquiry: Enquiry): void {
    this.enquiries = [enquiry, ...this.enquiries];
  }

  public removeEnquiryFromState(enqId: string): void {
    this.enquiries = this.enquiries.filter(
      (enquiry) => enquiry.enquiry_id !== enqId,
    );
  }
}
