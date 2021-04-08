import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { BooleanValueAccessor } from "@ionic/angular";
import { Observable } from "rxjs";
import { InspectionTask } from "../models/inspection-task";

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
  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/lists.field.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48
  public getEnvironmentalInspectionListsFields(list: number): Promise<any> {
    return this.http
      .get(
        `${this.url}/${this.key}/lists.field.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}`
      )
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.fields.json
  public getDealFields(): Promise<any> {
    return this.http
      .get(`${this.url}/${this.key}/crm.deal.fields.json`)
      .toPromise();
  }

  public getContact(id: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(`${this.url}/${this.key}/crm.contact.get.json?ID=${id}`)
      .toPromise();
  }

  public getAllContacts(): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(`${this.url}/${this.key}/crm.contact.list.json`)
      .toPromise();
  }

  public getCompanyContact(id: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(`${this.url}/${this.key}/crm.company.get.json?ID=${id}`)
      .toPromise();
  }

  public getAllCompanyContact(): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(`${this.url}/${this.key}/crm.company.list.json`)
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.list.json?SELECT[]=EMAIL&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=PHONE&FILTER[EMAIL]=pabs.aguilar2806
  public getContactByPhone(phone: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(
        `${this.url}/${this.key}/crm.contact.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[PHONE]=${phone}`
      )
      .toPromise();
  }

  public getContactByEmail(email: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(
        `${this.url}/${this.key}/crm.contact.list.json?SELECT[]=EMAIL&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=PHONE&FILTER[EMAIL]=${email}`
      )
      .toPromise();
  }

  public getCompaniesByName(name: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.company.list.json?SELECT[]=*&FILTER[%TITLE]=Test
    https: return this.http
      .get(
        `${this.url}/${this.key}/crm.company.list.json?SELECT[]=TITLE&SELECT[]=EMAIL&SELECT[]=PHONE&SELECT[]=COMPANY_TYPE&FILTER[%TITLE]=${name}`
      )
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[UF_CRM_1612682994]=6
  public getInspectionsDeals(idUser: number): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(
        `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[UF_CRM_1612682994]=${idUser}`
      )
      .toPromise();
  }

  public syncDamageAreaInspection(
    postData: any,
    list: number
  ): Observable<any> {
    if (postData.ELEMENT_ID) {
      return this.http.post(
        //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
        `${this.url}/${this.key}/lists.element.update`,
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return this.http.post(
        //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
        `${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}`,
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  public createSubfolder(postData: any): Observable<any> {
    return this.http.post(
      `${this.url}/${this.key}/disk.folder.addsubfolder`,
      postData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  public updateDeal(postData: any): Observable<any> {
    return this.http.post(`${this.url}/${this.key}/crm.deal.update`, postData, {
      headers: { "Content-Type": "application/json" },
    });
  }

  public createDeal(postData: any): Observable<any> {
    return this.http.post(`${this.url}/${this.key}/crm.deal.add`, postData, {
      headers: { "Content-Type": "application/json" },
    });
  }

  public createContact(postData: any): Observable<any> {
    return this.http.post(`${this.url}/${this.key}/crm.contact.add`, postData, {
      headers: { "Content-Type": "application/json" },
    });
  }

  public createCompany(postData: any): Observable<any> {
    return this.http.post(`${this.url}/${this.key}/crm.company.add`, postData, {
      headers: { "Content-Type": "application/json" },
    });
  }

  public addFile(postData: any): Promise<any> {
    return this.http
      .post(`${this.url}/${this.key}/disk.folder.uploadfile`, postData, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }
}
