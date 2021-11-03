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
import { BitrixTokenSetupService } from "./bitrix-token-setup.service";

@Injectable({
  providedIn: "root",
})
export class BitrixItestService {
  constructor(
    private http: HttpClient,
    authService: AuthenticationService,
    private bitrixTokenService: BitrixTokenSetupService
  ) {
    bitrixTokenService.getBitrixSetup().then((y) => {
      authService.getUser().then((x) => {
        if (!x) {
          return;
        }
        if (x.enterprise === EnumEnterprise.itest) {
          this.url = y.itestURL;
          this.key = y.itestToken;
        } else {
          this.url = y.expertNetworksURL;
          this.key = y.expertNetworksToken;
        }
      });
    });
  }

  async setUrlandKey(enterprise) {
    var y = await this.bitrixTokenService.getBitrixSetup();
    if (enterprise === EnumEnterprise.itest) {
      this.url = y.itestURL;
      this.key = y.itestToken;
    } else {
      this.url = y.expertNetworksURL;
      this.key = y.expertNetworksToken;
    }
  }
  url = ""; //url = "https://itest.bitrix24.com/rest/6";
  key = ""; //key = "rf1a6ygkrbdsho5t";

  public getUserByEmail(url: string, key: string, email: string): Promise<any> {
    return this.http
      .get(`${url}/${key}/user.get.json?email=${email}`)
      .toPromise();
  }

  public getInspectionTypesITest(list: string): Promise<any> {
    return this.http
      .get(
        `${this.url}/${this.key}/lists.element.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}`
      )
      .toPromise();
  }

  public async testSetup(url: string, key: string): Promise<boolean> {
    try {
      var x = await this.http.get(`${url}/${key}/crm.deal.fields.json`);
      var res: any = await x.toPromise();

      if (res && res.result && res.result.ID) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
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

  public async getContactByEmailByEnterprise(
    email: string,
    enterprise: string
  ): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    var y = await this.bitrixTokenService.getBitrixSetup();
    var tempUrl = this.url;
    var tempKey = this.key;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = y.itestURL;
      tempKey = y.itestToken;
    } else {
      tempUrl = y.expertNetworksURL;
      tempKey = y.expertNetworksToken;
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

  public async getCompaniesByNameAndEnterprise(
    name: string,
    enterprise: string
  ): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.company.list.json?SELECT[]=*&FILTER[%TITLE]=Test
    var y = await this.bitrixTokenService.getBitrixSetup();
    var tempUrl = this.url;
    var tempKey = this.key;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = y.itestURL;
      tempKey = y.itestToken;
    } else {
      tempUrl = y.expertNetworksURL;
      tempKey = y.expertNetworksToken;
    }

    https: return this.http
      .get(
        `${tempUrl}/${tempKey}/crm.company.list.json?SELECT[]=TITLE&SELECT[]=EMAIL&SELECT[]=PHONE&SELECT[]=COMPANY_TYPE&FILTER[%TITLE]=${name}`
      )
      .toPromise();
  }

  //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[UF_CRM_1612682994]=6
  public async getInspectionsDeals(user: User): Promise<any> {
    //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
    var inspectorField =
      user.enterprise == EnumEnterprise.itest
        ? ITestDealMapping.inspector
        : ENDealMapping.inspector;
    if (user.enterprise == EnumEnterprise.itest) {
      var newDeals: any = await this.http
        .get(
          `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[${inspectorField}]=${user.userId}`
        )
        .toPromise();

      if (newDeals) {
        var inProgress: any = await this.http
          .get(
            `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=EXECUTING&FILTER[${inspectorField}]=${user.userId}`
          )
          .toPromise();

        newDeals.result.push(...inProgress.result);
        return newDeals;
      }
    } else {
      return this.http
        .get(
          `${this.url}/${this.key}/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=C15:FINAL_INVOICE&FILTER[${inspectorField}]=${user.userId}`
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
    var random = Math.floor(Math.random() * 100) + 2;

    if (postData.ELEMENT_ID) {
      return this.http.post(
        //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
        `${this.url}/${this.key}/lists.element.update?random=${random}`,
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return this.http.post(
        //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
        `${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=${list}&random=${random}`,
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

  public async createDeal(postData: any, enterprise: string): Promise<any> {
    var y = await this.bitrixTokenService.getBitrixSetup();
    var tempUrl = this.url;
    var tempKey = this.key;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = y.itestURL;
      tempKey = y.itestToken;
    } else {
      tempUrl = y.expertNetworksURL;
      tempKey = y.expertNetworksToken;
    }
    return this.http
      .post(`${tempUrl}/${tempKey}/crm.deal.add`, postData, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }

  public async createContact(postData: any, enterprise: string): Promise<any> {
    var y = await this.bitrixTokenService.getBitrixSetup();
    var tempUrl = this.url;
    var tempKey = this.key;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = y.itestURL;
      tempKey = y.itestToken;
    } else {
      tempUrl = y.expertNetworksURL;
      tempKey = y.expertNetworksToken;
    }

    return this.http
      .post(`${tempUrl}/${tempKey}/crm.contact.add`, postData, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }

  public async createCompany(postData: any, enterprise: string): Promise<any> {
    var y = await this.bitrixTokenService.getBitrixSetup();
    var tempUrl = this.url;
    var tempKey = this.key;
    if (enterprise === EnumEnterprise.itest) {
      tempUrl = y.itestURL;
      tempKey = y.itestToken;
    } else {
      tempUrl = y.expertNetworksURL;
      tempKey = y.expertNetworksToken;
    }
    return this.http
      .post(`${tempUrl}/${tempKey}/crm.company.add`, postData, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }

  public addFile(postData: any): Promise<any> {
    return this.http
      .post(`${this.url}/${this.key}/disk.folder.uploadfile`, postData, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }
}
