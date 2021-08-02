import { Injectable } from "@angular/core";
import {
  ITestDealMapping,
  bitrixMappingEnvironmental,
  DamageAreaType,
  InspectionStatus,
  InspectionType,
  BitrixListsITest,
  EnumEnterprise,
  ENDealMapping,
  bitrixMappingComprehensive,
  ReportStatusDeal,
  BitrixCodeDeals,
} from "../models/enums";
import { EnvironmentalForm } from "../models/environmental-form";
import { TaskSubtype } from "../models/task-subtype";
import { GenericStorageService } from "./generic-storage.service";
import { InspectionsStorageService } from "./inspections-storage.service";
import { Storage } from "@ionic/storage";
import { BitrixItestService } from "./bitrix-itest.service";
import { InspectionTask } from "../models/inspection-task";
import { DamageInspection } from "../models/damage-inspection";
import { Sample } from "../models/environmental-form/sample";
import { GeneralInfoInspection } from "../models/comprehensive-form/general-info-inspection";
import { MoistureMappingAreas } from "../models/environmental-form/moisture-mapping-areas";
import { MoistureMapping } from "../models/environmental-form/moisture-mapping";
import { Asbesto } from "../models/environmental-form/asbesto";
import { Lead } from "../models/environmental-form/lead";
import { Contact } from "../models/contact";
import { Company } from "../models/company";
import { SyncInfo } from "../models/sync-info";
import { takeLast } from "rxjs/operators";
import { User } from "../models/user";
import { ComprehensiveForm } from "../models/comprehensive-form/comprehensive-form";
import { Area } from "../models/comprehensive-form/area";
import {
  GeneralCondition,
  //GeneralConditionBitrixMapping,
} from "../models/comprehensive-form/general-condition";
import { Kitchen } from "../models/comprehensive-form/kitchen";
import { DamageAreas } from "../models/environmental-form/damage-areas";
import { AsbestoAreas } from "../models/environmental-form/asbesto-areas";
import { LeadAreas } from "../models/environmental-form/lead-areas";

const SYNCSTAMPKEY = "inspection-stamp-key";
@Injectable({
  providedIn: "root",
})
export class ItestDealService {
  environmentalInspectionFieldsName: string = "environmental-inspection-fields";
  dealFieldName: string = "deals-fields";
  collectionTaskSubTypesName: string = "task-itest-subtypes-list";
  collectionInspectors: string = "inspectors";

  inspectionTypesListService = new GenericStorageService(
    this.collectionTaskSubTypesName,
    this.storage
  );

  environmentalInspectionFieldsListService = new GenericStorageService(
    this.environmentalInspectionFieldsName,
    this.storage
  );

  inspectorsService = new GenericStorageService(
    this.collectionInspectors,
    this.storage
  );

  dealsFieldsListService = new GenericStorageService(
    this.dealFieldName,
    this.storage
  );

  constructor(
    private inspectionStorage: InspectionsStorageService,
    private bitrixITest: BitrixItestService,
    private storage: Storage
  ) {}

  async setEnterprise(enterprise: string) {
    await this.bitrixITest.setUrlandKey(enterprise);
  }

  async update(task: InspectionTask) {
    return this.inspectionStorage.update(task);
  }

  async delete(task: InspectionTask) {
    return this.inspectionStorage.delete(task);
  }

  async getPendingToSyncCount(user: User): Promise<number> {
    var pending = await this.inspectionStorage.getPendingToSync(user);

    return pending.length;
  }

  async getContactPhone(phone: string): Promise<Contact> {
    var result = await this.bitrixITest.getContactByPhone(phone);
    if (result.length > 0) {
      var contact = new Contact();
      contact.firstName = result[0].NAME;
      contact.idContact = result[0].ID;
      contact.lastName = result[0].LAST_NAME;
      contact.email = result[0].EMAIL;
      contact.email = result[0].PHONE;
      contact.syncInfo.isSync = true;
      return contact;
    } else {
      return new Contact();
    }
  }

  async getCompaniesByName(
    name: string,
    enterprise: string
  ): Promise<Company[]> {
    var response = await this.bitrixITest.getCompaniesByNameAndEnterprise(
      name,
      enterprise
    );

    if (response && response.result && response.result.length > 0) {
      return Promise.all(
        response.result.map(async (item): Promise<any> => {
          var company = new Company();
          company.title = item.TITLE;
          company.type = item.COMPANY_TYPE;
          company.id = item.ID;
          if (item.EMAIL && item.EMAIL.length > 0) {
            company.email = item.EMAIL[0].VALUE;
          }
          if (item.PHONE && item.PHONE.length > 0) {
            company.phone = item.PHONE[0].VALUE;
          }

          company.syncInfo.isSync = true;
          company.syncInfo.syncCode = item.ID;

          return company;
        })
      );
    } else {
      return [];
    }
  }

  async getContactsByEmail(
    email: string,
    enterpise: string
  ): Promise<Contact[]> {
    var response = await this.bitrixITest.getContactByEmailByEnterprise(
      email,
      enterpise
    );

    if (response && response.result && response.result.length > 0) {
      return Promise.all(
        response.result.map(async (item): Promise<any> => {
          var contact = new Contact();
          contact.firstName = item.NAME;
          contact.idContact = item.ID;
          contact.lastName = item.LAST_NAME;
          if (item.EMAIL && item.EMAIL.length > 0) {
            contact.email = item.EMAIL[0].VALUE;
          }

          if (item.PHONE && item.PHONE.length > 0) {
            contact.phone = item.PHONE[0].VALUE;
          }

          contact.syncInfo.isSync = true;
          contact.syncInfo.syncCode = item.ID;

          return contact;
        })
      );
    } else {
      return [];
    }
  }

  async getPendingInspections(user: User) {
    var list = await this.inspectionStorage.getAll();

    var pending;
    if (list != null) {
      pending = list
        .filter((item) => {
          return (
            item.inspectorUserId == user.userId &&
            item.internalStatus !== InspectionStatus.Completed &&
            item.enterprise == user.enterprise
          );
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
    }

    return pending;
  }

  async login(url: string, token: string, email: string) {
    return await this.bitrixITest.getUserByEmail(url, token, email);
  }

  async getCompletedInspections() {
    var list = await this.inspectionStorage.getAll();
    if (list != null) {
      var completed = list
        .filter((item) => {
          return item.internalStatus == InspectionStatus.Completed;
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
      return completed;
    }
    return [];
  }

  async getStartedInspections(enterprise) {
    var list = await this.inspectionStorage.getAll();
    if (list != null) {
      var completed = list
        .filter((item) => {
          return (
            item.internalStatus !== InspectionStatus.New &&
            item.enterprise == enterprise
          );
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
      return completed;
    }
    return [];
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  async getInspectionTasksTypesList(): Promise<TaskSubtype[]> {
    var list = await this.inspectionTypesListService.getAll();

    if (list != null && list.length > 0) {
      return list;
    }
    return await this.getInspectionTasksTypesListFromServer();
  }

  async getInspectionTasksTypesListFromServer(): Promise<TaskSubtype[]> {
    var result = await this.bitrixITest.getInspectionTypesITest(
      ITestDealMapping.serviceTypeList
    );
    var list = result.result.map((x) => {
      var subType = new TaskSubtype();
      subType.id = x.ID;
      subType.blockId = x.IBLOCK_ID;
      subType.name = x.NAME;
      return subType;
    });

    this.inspectionTypesListService.addItems(list);
    return list;
  }

  async initializeAsbestosMapping(
    task: InspectionTask
  ): Promise<InspectionTask> {
    task.environmentalForm.asbestosAreas.inspectionDate = new Date();
    task.environmentalForm.asbestosAreas.inspectionDateString =
      new Date().toISOString();

    Promise.all(
      bitrixMappingEnvironmental.Asbestos.materialLocationCode.map(
        (t, index) => {
          var x = new Asbesto();
          task.environmentalForm.asbestosAreas.asbestosAreas.push(x);
        }
      )
    );
    return task;
  }

  async initializeLead(task: InspectionTask): Promise<InspectionTask> {
    task.environmentalForm.leadAreas.inspectionDate = new Date();
    task.environmentalForm.leadAreas.inspectionDateString =
      new Date().toISOString();

    Promise.all(
      bitrixMappingEnvironmental.Lead.sampleCode.map((t, index) => {
        var x = new Lead();

        task.environmentalForm.leadAreas.leadAreas.push(x);
      })
    );
    return task;
  }

  async initializeComprehensiveArea(
    task: InspectionTask
  ): Promise<InspectionTask> {
    Promise.all([
      bitrixMappingComprehensive.Area.nameCode.map((t, index) => {
        var x = new Area();

        task.comprehesiveForm.areas.push(x);
      }),
      bitrixMappingComprehensive.Bathrooms.conditionCode.map((x, index) => {
        var area = new GeneralCondition();
        task.comprehesiveForm.bathrooms.push(area);
      }),
    ]);

    return task;
  }

  async initializeMoistureMapping(
    task: InspectionTask
  ): Promise<InspectionTask> {
    task.environmentalForm.moistureMappingAreas.dateTesed = new Date();
    task.environmentalForm.moistureMappingAreas.dateTesedString =
      new Date().toISOString();

    Promise.all(
      bitrixMappingEnvironmental.Moisture.areaCode.map((t, index) => {
        var x = new MoistureMapping();

        task.environmentalForm.moistureMappingAreas.areamoistureMapping.push(x);
      })
    );
    return task;
  }

  async initializeDamageMapping(
    damageType: string,
    task: InspectionTask
  ): Promise<InspectionTask> {
    var listDamageInspection: DamageInspection[] = [];
    for (
      let index = 0;
      index < bitrixMappingEnvironmental[damageType].areaNameCode.length;
      index++
    ) {
      var x = new DamageInspection(damageType);
      var s = new Sample(damageType);
      var s2 = new Sample(damageType);
      var s3 = new Sample(damageType);

      x.samples.push(s);
      x.samples.push(s2);
      x.samples.push(s3);

      listDamageInspection.push(x);
    }

    switch (damageType) {
      case DamageAreaType.Mold:
        task.environmentalForm.moldAreas.areasInspection = listDamageInspection;

        break;
      case DamageAreaType.Bacteria:
        task.environmentalForm.bacteriasAreas.areasInspection =
          listDamageInspection;
        break;
      case DamageAreaType.Soot:
        task.environmentalForm.sootAreas.areasInspection = listDamageInspection;

        break;
    }
    return task;
  }

  async initializeEnvironmentalTask(
    task: InspectionTask
  ): Promise<InspectionTask> {
    if (!task.environmentalForm) {
      task.environmentalForm = new EnvironmentalForm();
    }
    //initialize mold Areas
    task = await this.initializeDamageMapping(DamageAreaType.Mold, task);
    task = await this.initializeDamageMapping(DamageAreaType.Soot, task);
    task = await this.initializeDamageMapping(DamageAreaType.Bacteria, task);
    task = await this.initializeMoistureMapping(task);
    task = await this.initializeAsbestosMapping(task);
    task = await this.initializeLead(task);

    return task;
  }

  async initializeENTask(task: InspectionTask): Promise<InspectionTask> {
    if (!task.comprehesiveForm) {
      task.comprehesiveForm = new ComprehensiveForm();
    }
    //initialize mold Areas
    task = await this.initializeComprehensiveArea(task);

    return task;
  }

  async getEnvironmentalInspectionFields(): Promise<any> {
    var list = await this.environmentalInspectionFieldsListService.getAll();

    if (list != null) {
      return list;
    }
    await this.getEnvironmentalFromServerInspectionFields();
    return await this.environmentalInspectionFieldsListService.getAll();
  }

  async getInspectors(server: boolean): Promise<any> {
    var list = await this.inspectorsService.getAll();
    var usersList: User[] = [];
    if (!server && list != null) {
      return list;
    }

    var result = await this.bitrixITest.getInspectors();
    if (result.result) {
      usersList = result.result.map((x) => {
        return new User(x);
      });
      if (usersList && usersList.length > 0) {
        await this.inspectorsService.clear();
      }

      await this.inspectorsService.addItems(usersList);
    } else {
      console.log(result);
    }

    return usersList;
  }

  async getEnvironmentalFromServerInspectionFields(): Promise<any> {
    var responseMold =
      await this.bitrixITest.getEnvironmentalInspectionListsFields(
        BitrixListsITest.Mold
      );
    var responseBacteria =
      await this.bitrixITest.getEnvironmentalInspectionListsFields(
        BitrixListsITest.Bacteria
      );
    var responseSoot =
      await this.bitrixITest.getEnvironmentalInspectionListsFields(
        BitrixListsITest.Soot
      );
    var responseMoisture =
      await this.bitrixITest.getEnvironmentalInspectionListsFields(
        BitrixListsITest.Moisture
      );
    var responseAsbestos =
      await this.bitrixITest.getEnvironmentalInspectionListsFields(
        BitrixListsITest.Asbestos
      );
    var responseLeads =
      await this.bitrixITest.getEnvironmentalInspectionListsFields(
        BitrixListsITest.Leads
      );
    let obj = Object.assign(
      responseMold.result,
      responseBacteria.result,
      responseSoot.result,
      responseMoisture.result,
      responseAsbestos.result,
      responseLeads.result
    );

    if (obj) {
      await this.environmentalInspectionFieldsListService.clear();
      await this.environmentalInspectionFieldsListService.add(obj);
    }

    return await this.environmentalInspectionFieldsListService.getAll();
  }

  async getDealsFields(): Promise<any> {
    var list = await this.dealsFieldsListService.getAll();

    if (list != null) {
      return list;
    }

    return this.getDealsFieldsFromServer();
  }
  async getDealsFieldsFromServer(): Promise<any> {
    var reponseFields = await this.bitrixITest.getDealFields();
    if (reponseFields && reponseFields.result) {
      await this.dealsFieldsListService.clear();
      await this.dealsFieldsListService.add(reponseFields.result);
    }

    return await this.dealsFieldsListService.getAll();
  }

  async getExternal(user: User) {
    try {
      this.storage.set(SYNCSTAMPKEY, new Date());

      if (user.enterprise == EnumEnterprise.itest) {
        await this.RejectedInspection(user);
        await this.ArchiveInspection(user);
      }
      var startedList = await this.getStartedInspections(user.enterprise);
      var list = [];
      if (user.enterprise == EnumEnterprise.itest) {
        list = await this.getInspectionITestJson(user);
      } else {
        list = await this.getInspectionENJson(user);
      }

      for (let index = 0; index < list.length; index++) {
        var item = list[index] as InspectionTask;

        var itemStarted: InspectionTask = null;
        if (startedList != null && startedList.length > 0) {
          itemStarted = startedList.find((x) => {
            return x.id === item.id;
          });
        }

        if (itemStarted) {
          item = await this.MergeStartedInspection(item, itemStarted);
        } else {
          if (user.enterprise == EnumEnterprise.itest) {
            item = await this.getListAsbestos(item);
            item = await this.getListMoisture(item);
            item = await this.getListLead(item);
            item = await this.getListDamage(
              item,
              item.environmentalForm.moldAreas.syncInfo.syncCode,
              DamageAreaType.Mold,
              BitrixListsITest.Mold
            );

            item = await this.getListDamage(
              item,
              item.environmentalForm.sootAreas.syncInfo.syncCode,
              DamageAreaType.Soot,
              BitrixListsITest.Soot
            );
            item = await this.getListDamage(
              item,
              item.environmentalForm.bacteriasAreas.syncInfo.syncCode,
              DamageAreaType.Bacteria,
              BitrixListsITest.Bacteria
            );
          }
        }
        list[index] = item;
      }

      await Promise.all(
        startedList.map(async (element) => {
          if (
            !list.find(
              (x) => x.id == element.id && x.enterprise == element.enterprise
            )
          ) {
            list.push(element);
          }
        })
      );

      if (list && list.length > 0) {
        await this.inspectionStorage.clear();
      }

      return this.inspectionStorage.addItems(list);
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async MergeStartedInspection(
    item: InspectionTask,
    itemStarted: InspectionTask
  ): Promise<InspectionTask> {
    item.iTestAgreements = itemStarted.iTestAgreements;
    item.expertNetworkAgreements = itemStarted.expertNetworkAgreements;
    if (itemStarted.internalStatus != InspectionStatus.New) {
      item.internalStatus = itemStarted.internalStatus;
    }

    item.bitrixFolder = itemStarted.bitrixFolder;
    item.comprehesiveForm = itemStarted.comprehesiveForm;

    if (item.inspectionType == InspectionType.Environmental) {
      itemStarted.environmentalForm.generalInfoInspection.propertyYear =
        itemStarted.environmentalForm.generalInfoInspection.propertyYear
          ? itemStarted.environmentalForm.generalInfoInspection.propertyYear
          : item.environmentalForm.generalInfoInspection.propertyYear;
      itemStarted.environmentalForm.generalInfoInspection.propertyType =
        itemStarted.environmentalForm.generalInfoInspection.propertyType
          ? itemStarted.environmentalForm.generalInfoInspection.propertyType
          : item.environmentalForm.generalInfoInspection.propertyType;
      itemStarted.environmentalForm.generalInfoInspection.environmentalInspection =
        itemStarted.environmentalForm.generalInfoInspection
          .environmentalInspection
          ? itemStarted.environmentalForm.generalInfoInspection
              .environmentalInspection
          : item.environmentalForm.generalInfoInspection
              .environmentalInspection;
      itemStarted.environmentalForm.generalInfoInspection.interiorTemperature =
        itemStarted.environmentalForm.generalInfoInspection.interiorTemperature
          ? itemStarted.environmentalForm.generalInfoInspection
              .interiorTemperature
          : item.environmentalForm.generalInfoInspection.interiorTemperature;
      itemStarted.environmentalForm.generalInfoInspection.exteriorRelativeHumidity =
        itemStarted.environmentalForm.generalInfoInspection
          .exteriorRelativeHumidity
          ? itemStarted.environmentalForm.generalInfoInspection
              .exteriorRelativeHumidity
          : item.environmentalForm.generalInfoInspection
              .exteriorRelativeHumidity;
      itemStarted.environmentalForm.generalInfoInspection.HVACSystemCondition =
        itemStarted.environmentalForm.generalInfoInspection.HVACSystemCondition
          ? itemStarted.environmentalForm.generalInfoInspection
              .HVACSystemCondition
          : item.environmentalForm.generalInfoInspection.HVACSystemCondition;
      itemStarted.environmentalForm.generalInfoInspection.ductsCondition =
        itemStarted.environmentalForm.generalInfoInspection.ductsCondition
          ? itemStarted.environmentalForm.generalInfoInspection.ductsCondition
          : item.environmentalForm.generalInfoInspection.ductsCondition;
      itemStarted.environmentalForm.generalInfoInspection.atticCondition =
        itemStarted.environmentalForm.generalInfoInspection.atticCondition
          ? itemStarted.environmentalForm.generalInfoInspection.atticCondition
          : item.environmentalForm.generalInfoInspection.atticCondition;

      itemStarted.environmentalForm.generalInfoInspection.affectedArea =
        itemStarted.environmentalForm.generalInfoInspection.affectedArea
          ? itemStarted.environmentalForm.generalInfoInspection.affectedArea
          : item.environmentalForm.generalInfoInspection.affectedArea;

      item.environmentalForm = itemStarted.environmentalForm;
    } else {
      itemStarted.comprehesiveForm.generalInfoInspection.propertyYear =
        itemStarted.comprehesiveForm.generalInfoInspection.propertyYear
          ? itemStarted.comprehesiveForm.generalInfoInspection.propertyYear
          : item.comprehesiveForm.generalInfoInspection.propertyYear;
      itemStarted.comprehesiveForm.generalInfoInspection.propertyType =
        itemStarted.comprehesiveForm.generalInfoInspection.propertyType
          ? itemStarted.comprehesiveForm.generalInfoInspection.propertyType
          : item.comprehesiveForm.generalInfoInspection.propertyType;
      itemStarted.comprehesiveForm.generalInfoInspection.environmentalInspection =
        false;

      item.comprehesiveForm = itemStarted.comprehesiveForm;
    }

    return item;
  }

  async refreshFieldsFromServer(user: User) {
    //await this.getExternal(idUser);
    if (user.enterprise == EnumEnterprise.itest) {
      await this.getEnvironmentalFromServerInspectionFields();
    }

    await this.getDealsFieldsFromServer();
    await this.getInspectors(true);
  }
  async getSyncStamp() {
    return await this.storage.get(SYNCSTAMPKEY);
  }

  async getBitrixContact(contactId: string): Promise<Contact> {
    var bitrixContact: Contact = new Contact();
    if (!contactId) {
      return new Contact();
    }
    try {
      var contact = await this.bitrixITest.getContact(contactId);
      contact = contact.result;
      bitrixContact.firstName = contact.NAME;
      bitrixContact.lastName = contact.LAST_NAME;
      bitrixContact.idContact = contactId;
      bitrixContact.phone =
        Array.isArray(contact.PHONE) && contact.PHONE.length
          ? contact.PHONE[0].VALUE
          : null;
      bitrixContact.email =
        Array.isArray(contact.EMAIL) && contact.EMAIL.length
          ? contact.EMAIL[0].VALUE
          : null;
      bitrixContact.syncInfo = new SyncInfo();
      bitrixContact.syncInfo.isSync = true;
      bitrixContact.syncInfo.syncCode = contactId;
      return bitrixContact;
    } catch (error) {
      console.log(error);
    }
    return new Contact();
  }

  async getBitrixCompany(companyId: string): Promise<Company> {
    var bitrixCompany: Company = new Company();
    try {
      var company = await this.bitrixITest.getCompanyContact(companyId);
      company = company.result;

      bitrixCompany.title = company.TITLE;
      bitrixCompany.type = company.COMPANY_TYPE;
      bitrixCompany.id = companyId;
      bitrixCompany.phone =
        Array.isArray(company.PHONE) && company.PHONE.length
          ? company.PHONE[0].VALUE
          : null;
      bitrixCompany.email =
        Array.isArray(company.EMAIL) && company.EMAIL.length
          ? company.EMAIL[0].VALUE
          : null;

      bitrixCompany.syncInfo = new SyncInfo();
      bitrixCompany.syncInfo.isSync = true;
      bitrixCompany.syncInfo.syncCode = companyId;
    } catch (error) {
      console.log(error);
    }
    return bitrixCompany;
  }

  async RejectedInspection(user: User) {
    var data = await this.bitrixITest.getDealsIdByStatus(
      user,
      ReportStatusDeal.Rejected
    );
    if (data.result.length > 0) {
      return Promise.all(
        data.result.map(async (x) => {
          var item = await this.inspectionStorage.get(x.ID, user.enterprise);
          if (
            item &&
            item.wasRejected &&
            (item.internalStatus == InspectionStatus.Saved ||
              item.internalStatus == InspectionStatus.LabsSent ||
              item.internalStatus.indexOf("Pending") > 0)
          ) {
            return;
          }
          if (item) {
            item.internalStatus = InspectionStatus.Saved;
            item.wasRejected = true;
            return this.inspectionStorage.update(item);
          }
        })
      );
    }
  }

  async ArchiveInspection(user: User) {
    var data = await this.bitrixITest.getDealsIdByStatus(
      user,
      ReportStatusDeal.Archived
    );
    if (data.result.length > 0) {
      return Promise.all(
        data.result.map(async (x) => {
          var item = await this.inspectionStorage.get(x.ID, user.enterprise);
          if (item && item.internalStatus.indexOf("Pending") <= 0) {
            return await this.inspectionStorage.delete(item);
          }
        })
      );
    }
  }
  async isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
  }
  async getListDamage(
    task: InspectionTask,
    id: string,
    type: string,
    list: number
  ): Promise<InspectionTask> {
    if (!id) {
      return task;
    }
    var data = await this.bitrixITest.getEnvironmentalInspectionListsById(
      id,
      list
    );
    if (!data || data.result.length <= 0) {
      return task;
    }

    data = data.result[0];

    var damageAreas: DamageAreas = new DamageAreas(type);

    var damageInspectionList: DamageInspection[] = [];
    //

    var sync = new SyncInfo();
    sync.isSync = true;
    sync.syncCode = id;
    damageAreas.syncInfo = sync;
    for (let index = 0; index < 10; index++) {
      var fields = Object.entries(bitrixMappingEnvironmental[type]);

      var damageItem: DamageInspection = new DamageInspection(type);
      damageItem.samples.push(new Sample(type));
      damageItem.samples.push(new Sample(type));
      damageItem.samples.push(new Sample(type));

      var typeValue =
        data[bitrixMappingEnvironmental[type].inspectionHeader.inspectionType];
      if (typeValue && Object.values(typeValue)) {
        damageAreas.moldInspectionType = Object.values(typeValue)[0] as string;
      }

      Promise.all(
        fields.map((y) => {
          if (y[0] == "inspectionHeader" || y[0].includes("Pictures")) {
            return;
          }

          if (y[0].includes("Sample1")) {
            var field = y[0].replace("CodeSample1", "");
            var value = data[y[1][index]];
            if (
              value &&
              typeof Object.values(value)[0] === "object" &&
              Object.values(value)[0] !== null &&
              Object.values(value)[0]["TEXT"]
            ) {
              value = Object.values(value)[0]["TEXT"];
            } else if (value && this.isString(Object.values(value)[1])) {
              value = Object.values(value)[0];
            }
            damageItem.samples[0][field] = value == 0 ? null : value;

            return;
          }
          if (y[0].includes("Sample2")) {
            var field = y[0].replace("CodeSample2", "");
            var value = data[y[1][index]];
            if (
              value &&
              typeof Object.values(value)[0] === "object" &&
              Object.values(value)[0] !== null &&
              Object.values(value)[0]["TEXT"]
            ) {
              value = Object.values(value)[0]["TEXT"];
            } else if (value && this.isString(Object.values(value)[1])) {
              value = Object.values(value)[0];
            }
            damageItem.samples[1][field] = value == 0 ? null : value;

            return;
          }

          if (y[0].includes("Sample3")) {
            var field = y[0].replace("CodeSample3", "");
            var value = data[y[1][index]];
            if (
              value &&
              typeof Object.values(value)[0] === "object" &&
              Object.values(value)[0] !== null &&
              Object.values(value)[0]["TEXT"]
            ) {
              value = Object.values(value)[0]["TEXT"];
            } else if (value && this.isString(Object.values(value)[1])) {
              value = Object.values(value)[0];
            }
            damageItem.samples[2][field] = value == 0 ? null : value;

            return;
          }

          var field = y[0].replace("Code", "");
          var value = data[y[1][index]];
          if (
            value &&
            typeof Object.values(value)[0] === "object" &&
            Object.values(value)[0] !== null &&
            Object.values(value)[0]["TEXT"]
          ) {
            value = Object.values(value)[0]["TEXT"];
          } else if (value && this.isString(Object.values(value)[1])) {
            value = Object.values(value)[0];
          }
          damageItem[field] = value == 0 ? null : value;
        })
      );

      damageAreas.areasInspection.push(damageItem);
    }

    if (type == DamageAreaType.Mold) {
      task.environmentalForm.moldAreas = damageAreas;
    }
    if (type == DamageAreaType.Soot) {
      task.environmentalForm.sootAreas = damageAreas;
    }

    if (type == DamageAreaType.Bacteria) {
      task.environmentalForm.bacteriasAreas = damageAreas;
    }

    return task;
  }

  async getListAsbestos(task: InspectionTask): Promise<InspectionTask> {
    var id: string = task.environmentalForm.asbestosAreas.syncInfo.syncCode;
    if (!id) {
      return task;
    }
    var data = await this.bitrixITest.getEnvironmentalInspectionListsById(
      id,
      BitrixListsITest.Asbestos
    );
    if (!data || data.result.length <= 0) {
      return task;
    }

    data = data.result[0];

    var asbestosAreas: AsbestoAreas = new AsbestoAreas();

    var sync = new SyncInfo();
    sync.isSync = true;
    sync.syncCode = id;
    asbestosAreas.syncInfo = sync;

    var typeValue =
      data[
        bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionTypeCode
      ];
    if (typeValue && Object.values(typeValue)) {
      asbestosAreas.inspectionType = Object.values(typeValue)[0] as string;
    }

    typeValue =
      data[
        bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionDateCode
      ];
    if (typeValue && Object.values(typeValue)) {
      asbestosAreas.inspectionDate = new Date(
        Object.values(typeValue)[0] as Date
      );
    }

    for (let index = 0; index < 20; index++) {
      var fields = Object.entries(bitrixMappingEnvironmental.Asbestos);
      var asbestoAreaItem: Asbesto = new Asbesto();

      Promise.all(
        fields.map((y) => {
          if (y[0] == "asbestosHeader" || y[0].includes("Pictures")) {
            return;
          }

          var field = y[0].replace("Code", "");
          var value = data[y[1][index]];
          if (
            value &&
            typeof Object.values(value)[0] === "object" &&
            Object.values(value)[0] !== null &&
            Object.values(value)[0]["TEXT"]
          ) {
            value = Object.values(value)[0]["TEXT"];
          } else if (value && this.isString(Object.values(value)[1])) {
            value = Object.values(value)[0];
          }
          asbestoAreaItem[field] = value == 0 ? null : value;
        })
      );

      asbestosAreas.asbestosAreas.push(asbestoAreaItem);
    }
    task.environmentalForm.asbestosAreas = asbestosAreas;
    return task;
  }

  async getListMoisture(task: InspectionTask): Promise<InspectionTask> {
    var id: string =
      task.environmentalForm.moistureMappingAreas.syncInfo.syncCode;
    if (!id) {
      return task;
    }
    var data = await this.bitrixITest.getEnvironmentalInspectionListsById(
      id,
      BitrixListsITest.Moisture
    );
    if (!data || data.result.length <= 0) {
      return task;
    }

    data = data.result[0];

    var moistureAreas: MoistureMappingAreas = new MoistureMappingAreas();

    var sync = new SyncInfo();
    sync.isSync = true;
    sync.syncCode = id;
    moistureAreas.syncInfo = sync;
    var typeValue =
      data[
        bitrixMappingEnvironmental.Moisture.moistureHeader.inspectionTypeCode
      ];
    if (typeValue && Object.values(typeValue)) {
      moistureAreas.inspectionType = Object.values(typeValue)[0] as string;
    }

    typeValue =
      data[bitrixMappingEnvironmental.Moisture.moistureHeader.dateTesedCode];
    if (typeValue && Object.values(typeValue)) {
      moistureAreas.dateTesed = new Date(Object.values(typeValue)[0] as Date);
    }

    for (let index = 0; index < 20; index++) {
      var fields = Object.entries(bitrixMappingEnvironmental.Moisture);
      var moistureAreaItem: MoistureMapping = new MoistureMapping();

      Promise.all(
        fields.map((y) => {
          if (y[0] == "moistureHeader" || y[0].includes("Pictures")) {
            return;
          }

          var field = y[0].replace("Code", "");
          var value = data[y[1][index]];
          if (
            value &&
            typeof Object.values(value)[0] === "object" &&
            Object.values(value)[0] !== null &&
            Object.values(value)[0]["TEXT"]
          ) {
            value = Object.values(value)[0]["TEXT"];
          } else if (value && this.isString(Object.values(value)[1])) {
            value = Object.values(value)[0];
          }
          moistureAreaItem[field] = value == 0 ? null : value;
        })
      );

      moistureAreas.areamoistureMapping.push(moistureAreaItem);
    }
    task.environmentalForm.moistureMappingAreas = moistureAreas;
    return task;
  }

  async getListLead(task: InspectionTask): Promise<InspectionTask> {
    var id: string = task.environmentalForm.leadAreas.syncInfo.syncCode;
    if (!id) {
      return task;
    }
    var data = await this.bitrixITest.getEnvironmentalInspectionListsById(
      id,
      BitrixListsITest.Leads
    );
    if (!data || data.result.length <= 0) {
      return task;
    }

    data = data.result[0];

    var leadAreas: LeadAreas = new LeadAreas();

    var sync = new SyncInfo();
    sync.isSync = true;
    sync.syncCode = id;
    leadAreas.syncInfo = sync;
    var typeValue =
      data[bitrixMappingEnvironmental.Lead.leadHeader.inspectionTypeCode];
    if (typeValue && Object.values(typeValue)) {
      leadAreas.inspectionType = Object.values(typeValue)[0] as string;
    }

    typeValue =
      data[bitrixMappingEnvironmental.Lead.leadHeader.inspectionDateCode];
    if (typeValue && Object.values(typeValue)) {
      leadAreas.inspectionDate = new Date(Object.values(typeValue)[0] as Date);
    }

    for (let index = 0; index < 20; index++) {
      var fields = Object.entries(bitrixMappingEnvironmental.Lead);
      var leadAreaItem: Lead = new Lead();

      Promise.all(
        fields.map((y) => {
          if (y[0] == "leadHeader" || y[0].includes("Pictures")) {
            return;
          }

          var field = y[0].replace("Code", "");
          var value = data[y[1][index]];
          if (
            value &&
            typeof Object.values(value)[0] === "object" &&
            Object.values(value)[0] !== null &&
            Object.values(value)[0]["TEXT"]
          ) {
            value = Object.values(value)[0]["TEXT"];
          } else if (value && this.isString(Object.values(value)[1])) {
            value = Object.values(value)[0];
          }
          leadAreaItem[field] = value == 0 ? null : value;
        })
      );

      leadAreas.leadAreas.push(leadAreaItem);
    }
    task.environmentalForm.leadAreas = leadAreas;
    return task;
  }

  async getInspectionITestJson(user: User): Promise<InspectionTask[]> {
    try {
      var subtypes = await this.getInspectionTasksTypesList();
      var data = await this.bitrixITest.getInspectionsDeals(user);

      if (data.result.length > 0) {
        var list: InspectionTask[] = await Promise.all(
          data.result
            .filter(
              (z) =>
                z[BitrixCodeDeals.ReportStatus] != ReportStatusDeal.Archived
            )
            .map(async (x): Promise<InspectionTask> => {
              var taskContact = await this.getBitrixContact(x.CONTACT_ID);

              var task = await this.initializeEnvironmentalTask(
                new InspectionTask()
              );

              var reportStatusBitrix: number = x[BitrixCodeDeals.ReportStatus];
              switch (+reportStatusBitrix) {
                case ReportStatusDeal.Saved:
                  task.internalStatus = InspectionStatus.Saved;
                  break;

                case ReportStatusDeal.Labs:
                  task.internalStatus = InspectionStatus.LabsSent;
                  break;

                case ReportStatusDeal.Submitted:
                  task.internalStatus = InspectionStatus.Completed;
                  break;
                case ReportStatusDeal.Rejected:
                  task.internalStatus = InspectionStatus.Saved;
                  task.wasRejected = true;
                  break;

                default:
                  task.internalStatus = InspectionStatus.New;
                  break;
              }

              task.id = x.ID;
              task.contactId = x.CONTACT_ID;
              task.contactName =
                (taskContact?.firstName ? taskContact.firstName : "") +
                " " +
                (taskContact?.lastName ? taskContact.lastName : "");

              task.title = x.TITLE;
              task.scheduleDateTime = new Date(
                x[ITestDealMapping.dealDateTime]
              );
              task.scheduleDay = new Date(
                task.scheduleDateTime.getFullYear(),
                task.scheduleDateTime.getMonth(),
                task.scheduleDateTime.getDate()
              );

              if (x[ITestDealMapping.agreementSignedYesNoCode] == 5204) {
                task.iTestAgreements.hasOpen = true;
                task.expertNetworkAgreements.hasOpen = true;
                task.iTestAgreements.isSigned = true;
                task.expertNetworkAgreements.isSigned = true;
              }

              task.serviceAddress = x[ITestDealMapping.serviceAddress];
              task.environmentalForm.generalInfoInspection.environmentalInspection =
                true;
              task.environmentalForm.generalInfoInspection.propertyYear =
                x[ITestDealMapping.propertyYearCode];
              task.environmentalForm.generalInfoInspection.propertyType =
                x[ITestDealMapping.propertyTypeCode];
              task.environmentalForm.generalInfoInspection.interiorTemperature =
                x[ITestDealMapping.interiorTemperatureCode];
              task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity =
                x[ITestDealMapping.exteriorRelativeHumidityCode];
              task.environmentalForm.generalInfoInspection.HVACSystemCondition =
                x[ITestDealMapping.HVACSystemConditionCode];
              task.environmentalForm.generalInfoInspection.ductsCondition =
                x[ITestDealMapping.ductsConditionCode];
              task.environmentalForm.generalInfoInspection.atticCondition =
                x[ITestDealMapping.atticConditionCode];
              task.environmentalForm.generalInfoInspection.atticCondition =
                x[ITestDealMapping.atticConditionCode];
              task.environmentalForm.generalInfoInspection.typeOfLossDesc =
                x[ITestDealMapping.typesOfLoss];
              task.environmentalForm.generalInfoInspection.affectedArea =
                x[ITestDealMapping.affectedArea];
              // task.waterDamageCategory =
              //   x[ITestDealMapping.waterDamageCategory];
              // task.waterDamageClass = x[ITestDealMapping.waterDamageClass];
              task.environmentalForm.moldAreas.syncInfo.syncCode =
                x[ITestDealMapping.moldListIdCode];
              task.environmentalForm.bacteriasAreas.syncInfo.syncCode =
                x[ITestDealMapping.bacteriaListIdCode];
              task.environmentalForm.sootAreas.syncInfo.syncCode =
                x[ITestDealMapping.sootListIdCode];
              task.environmentalForm.moistureMappingAreas.syncInfo.syncCode =
                x[ITestDealMapping.moistureListIdCode];
              task.environmentalForm.asbestosAreas.syncInfo.syncCode =
                x[ITestDealMapping.asbestosListIdCode];
              task.environmentalForm.leadAreas.syncInfo.syncCode =
                x[ITestDealMapping.leadListIdCode];

              var address = task.serviceAddress.split("|");

              if (address.length > 1) {
                task.serviceAddress = address[0];
                task.geoPointText = address[1].replace(";", ",");
              }

              task.phone = taskContact.phone;
              task.email = taskContact.email;

              if (
                Array.isArray(x[ITestDealMapping.insuranceCompany]) &&
                x[ITestDealMapping.insuranceCompany].length > 0
              ) {
                await Promise.all(
                  x[ITestDealMapping.insuranceCompany].map(
                    async (element: string) => {
                      if (element.includes("C_")) {
                        var insuranceContact = await this.getBitrixContact(
                          element.split("C_")[1]
                        );
                        task.insuranceContact = insuranceContact;
                      }
                      if (element.includes("CO_")) {
                        var insuranceCompany = await this.getBitrixCompany(
                          element.split("CO_")[1]
                        );
                        if (insuranceCompany) {
                          task.insuranceCompany = insuranceCompany;
                        }
                      }
                    }
                  )
                );
              }

              if (
                Array.isArray(x[ITestDealMapping.referenceContact]) &&
                x[ITestDealMapping.referenceContact].length > 0
              ) {
                await Promise.all(
                  x[ITestDealMapping.referenceContact].map(
                    async (element: string) => {
                      if (element.includes("C_")) {
                        var contactReference = await this.getBitrixContact(
                          element.split("C_")[1]
                        );
                        task.referalPartnerContact = contactReference;
                      }
                      if (element.includes("CO_")) {
                        var companyReference = await this.getBitrixCompany(
                          element.split("CO_")[1]
                        );
                        if (companyReference) {
                          task.referalPartnerCompany = companyReference;
                        }
                      }
                    }
                  )
                );
              }

              task.inspectorUserId = x[ITestDealMapping.inspector];
              task.inspectionType = InspectionType.Environmental;
              task.enterprise = EnumEnterprise.itest;
              task.inspectionSubTypes = x[ITestDealMapping.inspectionTypes].map(
                (m) => {
                  if (m != 120) {
                    return subtypes.find((y) => y.id == m);
                  }
                }
              );
              if (
                task.inspectionSubTypes.length == 1 &&
                !task.inspectionSubTypes[0]
              ) {
                task.inspectionSubTypes = [];
              }
              task.inspectionSubTypesString = task.inspectionSubTypes
                .map((type) => {
                  return type?.name;
                  x;
                })
                .join(",");
              task.inspectionsInstructions = x[ITestDealMapping.instructions];
              task.policyNumber = x[ITestDealMapping.policyNumberCode];
              task.claimNumber = x[ITestDealMapping.claimNumberCode];
              task.dateOfLoss = x[ITestDealMapping.dateOfLossCode];
              //  task.internalStatus = InspectionStatus.New;

              return Promise.resolve(task);
            })
        );

        return list;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getInspectionENJson(user: User): Promise<InspectionTask[]> {
    try {
      //var subtypes = await this.getInspectionTasksTypesList();
      var data = await this.bitrixITest.getInspectionsDeals(user);

      if (data.result.length > 0) {
        var list: InspectionTask[] = await Promise.all(
          data.result.map(async (x): Promise<InspectionTask> => {
            var taskContact = await this.getBitrixContact(x.CONTACT_ID);

            var task = await this.initializeENTask(new InspectionTask());

            task.id = x.ID;
            task.contactId = x.CONTACT_ID;
            task.contactName =
              taskContact.firstName + " " + taskContact.lastName;

            task.title = x.TITLE;
            task.scheduleDateTime = new Date(x[ENDealMapping.dealDateTime]);
            task.scheduleDay = new Date(
              task.scheduleDateTime.getFullYear(),
              task.scheduleDateTime.getMonth(),
              task.scheduleDateTime.getDate()
            );

            task.serviceAddress = x[ENDealMapping.serviceAddress];
            task.comprehesiveForm.generalInfoInspection.propertyYear =
              x[ENDealMapping.propertyYearCode];
            task.comprehesiveForm.generalInfoInspection.propertyType =
              x[ENDealMapping.propertyTypeCode];

            task.comprehesiveForm.generalInfoInspection.environmentalInspection =
              false;

            var address = task.serviceAddress?.split("|");

            if (address?.length > 1) {
              task.serviceAddress = address[0];
              task.geoPointText = address[1].replace(";", ",");
            }

            task.phone = taskContact.phone;
            task.email = taskContact.email;

            if (
              Array.isArray(x[ENDealMapping.insuranceCompany]) &&
              x[ENDealMapping.insuranceCompany].length > 0
            ) {
              await Promise.all(
                x[ENDealMapping.insuranceCompany].map(
                  async (element: string) => {
                    if (element.includes("C_")) {
                      var insuranceContact = await this.getBitrixContact(
                        element.split("C_")[1]
                      );
                      task.insuranceContact = insuranceContact;
                    }
                    if (element.includes("CO_")) {
                      var insuranceCompany = await this.getBitrixCompany(
                        element.split("CO_")[1]
                      );
                      if (insuranceCompany) {
                        task.insuranceCompany = insuranceCompany;
                      }
                    }
                  }
                )
              );
            }

            if (
              Array.isArray(x[ENDealMapping.referenceContact]) &&
              x[ENDealMapping.referenceContact].length > 0
            ) {
              await Promise.all(
                x[ENDealMapping.referenceContact].map(
                  async (element: string) => {
                    if (element.includes("C_")) {
                      var contactReference = await this.getBitrixContact(
                        element.split("C_")[1]
                      );
                      task.referalPartnerContact = contactReference;
                    }
                    if (element.includes("CO_")) {
                      var companyReference = await this.getBitrixCompany(
                        element.split("CO_")[1]
                      );
                      if (companyReference) {
                        task.referalPartnerCompany = companyReference;
                      }
                    }
                  }
                )
              );
            }

            task.inspectorUserId = x[ENDealMapping.inspector];
            task.inspectionType = InspectionType.Comprehensive;

            task.enterprise = EnumEnterprise.expertNetworks;
            // task.inspectionSubTypes = x[ENDealMapping.inspectionTypes].map(
            //   (m) => {
            //     if (m != 120) {
            //       return subtypes.find((y) => y.id == m);
            //     }
            //   }
            // );
            // if (
            //   task.inspectionSubTypes.length == 1 &&
            //   !task.inspectionSubTypes[0]
            // ) {
            //   task.inspectionSubTypes = [];
            // }
            task.inspectionSubTypes = [];
            task.inspectionSubTypesString = task.inspectionSubTypes
              .map((type) => {
                return type?.name;
                x;
              })
              .join(",");
            task.inspectionsInstructions = x[ENDealMapping.instructions];
            task.internalStatus = InspectionStatus.New;

            return Promise.resolve(task);
          })
        );

        return list;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }
}
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}
