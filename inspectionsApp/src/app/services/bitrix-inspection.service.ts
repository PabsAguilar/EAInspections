import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BitrixInspectionService {
  constructor(private http: HttpClient) {}
  url = "https://expertnetwork.bitrix24.com/rest/159/";

  public getUserByEmail(email: string): Observable<any> {
    var key = "av26roukw3tcyfyf";
    return this.http.get(`${this.url}/${key}/user.get.json?email=${email}`);
  }
}
