import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { BooleanValueAccessor } from "@ionic/angular";
import { Observable, of } from "rxjs";
import {
  ENDealMapping,
  EnumEnterprise,
  ITestDealMapping,
  ReportStatusDeal,
} from "../models/enums";
import { InspectionTask } from "../models/inspection-task";
import { User } from "../models/user";
import { AuthenticationService } from "./authentication.service";
const iTestUrl = "https://itest.bitrix24.com/rest/6";
const iTestKey = "jz367c66ft48tm88"; //"rf1a6ygkrbdsho5t";

const eNUrl = "https://expertnetwork.bitrix24.com/rest/159/";
const eNKey = "av26roukw3tcyfyf";

@Injectable({
  providedIn: "root",
})
export class BitrixItestService {
  constructor(private http: HttpClient, authService: AuthenticationService) {
    authService.getUser().then((x) => {
      if (!x) {
        return;
      }
      if (x.enterprise === EnumEnterprise.itest) {
        this.url = iTestUrl;
        this.key = iTestKey;
      } else {
        this.url = eNUrl;
        this.key = eNKey;
      }
    });
  }

  setUrlandKey(enterprise) {
    if (enterprise === EnumEnterprise.itest) {
      this.url = iTestUrl;
      this.key = iTestKey;
    } else {
      this.url = eNUrl;
      this.key = eNKey;
    }
  }
  url = ""; //url = "https://itest.bitrix24.com/rest/6";
  key = ""; //key = "rf1a6ygkrbdsho5t";

  public getUserByEmail(email: string): Promise<any> {
    return this.http
      .get(`${this.url}/${this.key}/user.get.json?email=${email}`)
      .toPromise();
  }

  public getInspectionTypesITest(list: string): Promise<any> {
    return this.http
      .get(
        `${iTestUrl}/${iTestKey}/lists.element.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}`
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

  public getEnvironmentalInspectionListsById(
    id: string,
    list: number
  ): Promise<any> {
    return this.http
      .get(
        `${this.url}/${this.key}/lists.element.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}&FILTER[ID]=${id}`
      )
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/user.search.json?USER_TYPE=employee
  public getInspectors(): Promise<any> {
    return this.http
      .get(`${this.url}/${this.key}/user.search.json?USER_TYPE=employee`)
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

  public getContactByEmailByEnterprise(
    email: string,
    enterprise: string
  ): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    var tempUrl = iTestUrl;
    var tempKey = iTestKey;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = iTestUrl;
      tempKey = iTestKey;
    } else {
      tempUrl = eNUrl;
      tempKey = eNKey;
    }
    return this.http
      .get(
        `${tempUrl}/${tempKey}/crm.contact.list.json?SELECT[]=EMAIL&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=PHONE&FILTER[EMAIL]=${email}`
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

  public getCompaniesByNameAndEnterprise(
    name: string,
    enterprise: string
  ): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.company.list.json?SELECT[]=*&FILTER[%TITLE]=Test
    var tempUrl = iTestUrl;
    var tempKey = iTestKey;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = iTestUrl;
      tempKey = iTestKey;
    } else {
      tempUrl = eNUrl;
      tempKey = eNKey;
    }

    https: return this.http
      .get(
        `${tempUrl}/${tempKey}/crm.company.list.json?SELECT[]=TITLE&SELECT[]=EMAIL&SELECT[]=PHONE&SELECT[]=COMPANY_TYPE&FILTER[%TITLE]=${name}`
      )
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[UF_CRM_1612682994]=6
  public getInspectionsDeals(user: User): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    var inspectorField =
      user.enterprise == EnumEnterprise.itest
        ? ITestDealMapping.inspector
        : ENDealMapping.inspector;
    if (user.enterprise == EnumEnterprise.itest) {
      return this.http
        .get(
          `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[STAGE_ID]=EXECUTING&FILTER[UF_CRM_1613380179]=6928&FILTER[UF_CRM_1613380179]=6930&FILTER[UF_CRM_1613380179]=6936&FILTER[UF_CRM_1613380179]=&FILTER[${inspectorField}]=${user.userId}`
        )
        .toPromise();
    } else {
      return this.http
        .get(
          `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=NEW&FILTER[${inspectorField}]=${user.userId}`
        )
        .toPromise();
    }
  }

  public getDealsIdByStatus(user: User, dealStatus: number): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    var inspectorField =
      user.enterprise == EnumEnterprise.itest
        ? ITestDealMapping.inspector
        : ENDealMapping.inspector;
    if (user.enterprise == EnumEnterprise.itest) {
      return this.http
        .get(
          `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=ID&FILTER[UF_CRM_1613380179]=${dealStatus}&FILTER[${inspectorField}]=${user.userId}`
        )
        .toPromise();
    } else {
      return Promise.resolve([]);
    }
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

  public createDeal(postData: any, enterprise: string): Observable<any> {
    var tempUrl = iTestUrl;
    var tempKey = iTestKey;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = iTestUrl;
      tempKey = iTestKey;
    } else {
      tempUrl = eNUrl;
      tempKey = eNKey;
    }
    return this.http.post(`${tempUrl}/${tempKey}/crm.deal.add`, postData, {
      headers: { "Content-Type": "application/json" },
    });
  }

  public createContact(postData: any, enterprise: string): Observable<any> {
    var tempUrl = iTestUrl;
    var tempKey = iTestKey;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = iTestUrl;
      tempKey = iTestKey;
    } else {
      tempUrl = eNUrl;
      tempKey = eNKey;
    }

    return this.http.post(`${tempUrl}/${tempKey}/crm.contact.add`, postData, {
      headers: { "Content-Type": "application/json" },
    });
  }

  public createCompany(postData: any, enterprise: string): Observable<any> {
    var tempUrl = iTestUrl;
    var tempKey = iTestKey;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = iTestUrl;
      tempKey = iTestKey;
    } else {
      tempUrl = eNUrl;
      tempKey = eNKey;
    }

    return this.http.post(`${tempUrl}/${tempKey}/crm.company.add`, postData, {
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
