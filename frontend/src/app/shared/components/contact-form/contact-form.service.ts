import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ContactForm } from "../../interface/contactForm";
import { ApiResponse } from "../../interface/api-response";
import { firstValueFrom } from "rxjs";
import { requestOptions } from "../../utility/requests";

const url = environment.api.server+'about/';

@Injectable({providedIn:'root',})
export class ContactFormService{
  constructor(private httpClient:HttpClient)
  {}

  public async submitContactForm(data: ContactForm):Promise<ApiResponse<any>>
  {
    try
    {
      const res = await firstValueFrom(this.httpClient.post<ApiResponse<any>>(url+'submitContactForm', data, requestOptions({contentType:'application/json'})));
      return res;
    }
    catch(error:any)
    {
      console.error('contact form error:', error);
      return error.error || { success: false, message: 'Server error' };
    }
  }

}
