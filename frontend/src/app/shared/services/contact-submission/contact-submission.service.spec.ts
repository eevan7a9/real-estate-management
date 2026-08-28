import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { UserService } from '../../../user/user.service';
import { ContactSubmissionCreate } from '../../interface/contact-submission';
import { ContactSubmissionService } from './contact-submission.service';

describe('ContactSubmissionService', () => {
  let service: ContactSubmissionService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: UserService, useValue: { token: 'test-token' } }
      ]
    });

    service = TestBed.inject(ContactSubmissionService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('posts a contact submission with the optional bearer token', () => {
    const submission: ContactSubmissionCreate = {
      name: 'John Doe',
      email: 'john@example.com',
      topic: 'general',
      message: 'I have a question about the application.'
    };

    service.create(submission).subscribe();

    const request = httpTesting.expectOne(
      environment.api.server + 'contact-submissions'
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(submission);
    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer test-token'
    );

    request.flush({
      data: {
        submission_id: 'submission-id',
        createdAt: '2026-08-28T00:00:00.000Z'
      }
    });
  });
});
