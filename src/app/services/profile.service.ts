import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly BASE_URL = environment.cartApiBaseUrl;

  constructor(private http: HttpClient) {}

  // Send the profile text from the employee profile object to the express server.
  // The server will pass the text along to Watson which will return a profile JSON, which the server passes back here
  getProfile(answerData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/profile`, answerData);
  }
}
