import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  ContactSubmissionCreate,
  ContactSubmissionResponse
} from '../../interface/contact-submission';
import { requestOptions } from '../../utility/requests';
import { UserService } from '../../../user/user.service';

const contactSubmissionUrl = environment.api.server + 'contact-submissions';

@Injectable({
  providedIn: 'root'
})
export class ContactSubmissionService {
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  public create(
    submission: ContactSubmissionCreate
  ): Observable<ContactSubmissionResponse> {
    return this.http.post<ContactSubmissionResponse>(
      contactSubmissionUrl,
      submission,
      requestOptions({ token: this.userService.token })
    );
  }
}
