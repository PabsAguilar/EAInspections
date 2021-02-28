import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Injectable } from "@angular/core";
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
  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[EMAIL]=pabs.aguilar2806@gmail.com
  public getContactByPhone(phone: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(
        `${this.url}/${this.key}/crm.contact.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[PHONE]=${phone}`
      )
      .toPromise();
  }

  public getContactByEmail(phone: string): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    return this.http
      .get(
        `${this.url}/${this.key}/crm.contact.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[EMAIL]=${phone}`
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
    return this.http.post(
      //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
      `${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}`,
      postData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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

  public addFile(postData: any): Promise<any> {
    return this.http
      .post(`${this.url}/${this.key}/disk.folder.uploadfile`, postData, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }
}
