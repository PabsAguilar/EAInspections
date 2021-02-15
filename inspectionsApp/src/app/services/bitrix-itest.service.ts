import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BitrixItestService {
  constructor(private http: HttpClient) {}
  url = "https://itest.bitrix24.com/rest/6";
  key = "rf1a6ygkrbdsho5t";

  public getUserByEmail(email: string): Promise<any> {
    return this.http
      .get(`${this.url}/${this.key}/user.get.json?email=${email}`)
      .toPromise();
  }

  public getInspectionTypes(): Promise<any> {
    return this.http
      .get(
        `${this.url}/${this.key}/lists.element.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=44`
      )
      .toPromise();
  }

  public getContact(id: number): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(`${this.url}/${this.key}/crm.contact.get.json?ID=${id}`)
      .toPromise();
  }

  public getCompanyContact(id: number): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(`${this.url}/${this.key}/crm.company.get.json?ID=${id}`)
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE
  public getInspectionsDeals(id: number): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(
        `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE`
      )
      .toPromise();
  }
}
