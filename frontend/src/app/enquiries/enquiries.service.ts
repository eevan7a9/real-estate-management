import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
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

  public async fetchEnquiries(): Promise<ApiResponse<Enquiry[]>> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Enquiry[]>>(
          enquiryUrl,
          requestOptions({ token: this.userService.token })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async fetchEnquiry(enqId: string): Promise<ApiResponse<Enquiry>> {
    try {
      const token = this.userService.token;
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Enquiry>>(
          enquiryUrl + '/' + enqId,
          requestOptions({ token })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async createEnquiry(
    enquiry: EnquiryCreate,
    property: Partial<Property>
  ): Promise<ApiResponse<Enquiry>> {
    const token = this.userService.token;
    const formData = {
      ...enquiry,
      property: {
        property_id: property.property_id,
        name: property.name,
      },
    };
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<Enquiry>>(
          enquiryUrl,
          formData,
          requestOptions({ token })
        )
      );
      this.insertEnquiryToState(res.data);
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async removeEnquiry(enqId: string): Promise<ApiResponse> {
    const token = this.userService.token;
    const url = enquiryUrl + '/' + enqId;
    try {
      const res = await firstValueFrom(
        this.http.delete<ApiResponse>(url, requestOptions({ token }))
      );
      if (res && res.status === 200) {
        this.enquiries = this.enquiries.filter(
          (enquiry) => enquiry.enquiry_id !== enqId
        );
        return res;
      }
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async readEnquiry(enqId: string): Promise<void> {
    const token = this.userService.token;
    const url = enquiryUrl + '/' + enqId;
    try {
      const { data } = await firstValueFrom(
        this.http.patch<ApiResponse<Enquiry>>(
          url,
          { read: true },
          requestOptions({ token })
        )
      );
      // UPDATE ENQUIRIES && CURRENT ENQUIRY
      this.enquiries = this.enquiries.map((enquiry) =>
        enquiry.enquiry_id === enqId ? data : enquiry
      );
      this.enquiry = data;
    } catch (error) {
      console.error(error);
    }
  }

  public resetState(): void {
    this.enquiries = [];
    this.initialFetchDone.set(false);
  }

  public insertEnquiryToState(enquiry: Enquiry): void {
    this.enquiries = [enquiry, ...this.enquiries];
  }
}
