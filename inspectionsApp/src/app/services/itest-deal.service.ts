import { Injectable } from "@angular/core";
import {
  BitrixDealMapping,
  bitrixMapping,
  DamageAreaType,
  InspectionStatus,
  InspectionType,
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
import {
  GeneralInfoInspection,
  GeneralInfoInspectionBitrixMapping,
} from "../models/comprehensive-form/general-info-inspection";
import { MoistureMappingAreas } from "../models/environmental-form/moisture-mapping-areas";
import { MoistureMapping } from "../models/environmental-form/moisture-mapping";
import { Asbesto } from "../models/environmental-form/asbesto";
import { Lead } from "../models/environmental-form/lead";
import { Contact } from "../models/contact";
import { Company } from "../models/company";
import { SyncInfo } from "../models/sync-info";
import { takeLast } from "rxjs/operators";
import { User } from "../models/user";
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
    private bitrix: BitrixItestService,
    private storage: Storage
  ) {}

  async update(task: InspectionTask) {
    return this.inspectionStorage.update(task);
  }

  async getContactPhone(phone: string): Promise<Contact> {
    var result = await this.bitrix.getContactByPhone(phone);
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

  async getCompaniesByName(name: string): Promise<Company[]> {
    var response = await this.bitrix.getCompaniesByName(name);

    if (response && response.result && response.result.length > 0) {
      return Promise.all(
        response.result.map(
          async (item): Promise<any> => {
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

            return company;
          }
        )
      );
    } else {
      return [];
    }
  }

  async getContactsByEmail(email: string): Promise<Contact[]> {
    var response = await this.bitrix.getContactByEmail(email);

    if (response && response.result && response.result.length > 0) {
      return Promise.all(
        response.result.map(
          async (item): Promise<any> => {
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

            return contact;
          }
        )
      );
    } else {
      return [];
    }
  }

  async getPendingInspections(userId: number) {
    var list = await this.inspectionStorage.getAll();
    var pending;
    if (list != null) {
      pending = list
        .filter((item) => {
          return (
            item.inspectorUserId == userId &&
            item.internalStatus !== InspectionStatus.Completed
          );
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
    }

    return pending;
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

  async getStartedInspections() {
    var list = await this.inspectionStorage.getAll();
    if (list != null) {
      var completed = list
        .filter((item) => {
          return item.internalStatus !== InspectionStatus.New;
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
    var result = await this.bitrix.getInspectionTypes();
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
    task.environmentalForm.asbestosAreas.inspectionDateString = new Date().toISOString();
    task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionDateCode =
      bitrixMapping.Asbestos.asbestosHeader.inspectionDateCode;
    task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.contactCode =
      bitrixMapping.Asbestos.asbestosHeader.contactCode;
    task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionTypeCode =
      bitrixMapping.Asbestos.asbestosHeader.inspectionTypeCode;

    Promise.all(
      bitrixMapping.Asbestos.materialLocationCode.map((t, index) => {
        var x = new Asbesto();

        x.asbestoBitrixMaping.materialLocationCode =
          bitrixMapping.Asbestos.materialLocationCode[index];
          x.asbestoBitrixMaping.materialLocationOtherCode =
          bitrixMapping.Asbestos.materialLocationOtherCode[index];
        x.asbestoBitrixMaping.materialDescriptionCode =
          bitrixMapping.Asbestos.materialDescriptionCode[index];
        x.asbestoBitrixMaping.totalQuantityCode =
          bitrixMapping.Asbestos.totalQuantityCode[index];
        x.asbestoBitrixMaping.F_NFCode = bitrixMapping.Asbestos.F_NFCode[index];
        x.asbestoBitrixMaping.conditionCode =
          bitrixMapping.Asbestos.conditionCode[index];
        x.asbestoBitrixMaping.labResultsCode =
          bitrixMapping.Asbestos.labResultsCode[index];
        x.asbestoBitrixMaping.observationsCode =
          bitrixMapping.Asbestos.observationsCode[index];

        task.environmentalForm.asbestosAreas.asbestosAreas.push(x);
      })
    );
    return task;
  }

  async initializeLead(task: InspectionTask): Promise<InspectionTask> {
    task.environmentalForm.leadAreas.inspectionDate = new Date();
    task.environmentalForm.leadAreas.inspectionDateString = new Date().toISOString();
    task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionDateCode =
      bitrixMapping.Lead.leadHeader.inspectionDateCode;
    task.environmentalForm.leadAreas.leadAreasBitrixMapping.contactCode =
      bitrixMapping.Lead.leadHeader.contactCode;
    task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionTypeCode =
      bitrixMapping.Lead.leadHeader.inspectionTypeCode;
    Promise.all(
      bitrixMapping.Lead.sampleCode.map((t, index) => {
        var x = new Lead();
        x.bitrixMappingLead.sampleCode = bitrixMapping.Lead.sampleCode[index];
        x.bitrixMappingLead.sampleOtherCode = bitrixMapping.Lead.sampleOtherCode[index];
        x.bitrixMappingLead.cardinalDirectionCode =
          bitrixMapping.Lead.cardinalDirectionCode[index];
        x.bitrixMappingLead.dimensionCm2Code =
          bitrixMapping.Lead.dimensionCm2Code[index];
        x.bitrixMappingLead.materialCode =
          bitrixMapping.Lead.materialCode[index];
        x.bitrixMappingLead.typeOfSampleCode =
          bitrixMapping.Lead.typeOfSampleCode[index];
        x.bitrixMappingLead.labResultsCode =
          bitrixMapping.Lead.labResultsCode[index];
        x.bitrixMappingLead.observationsCode =
          bitrixMapping.Lead.observationsCode[index];

        task.environmentalForm.leadAreas.leadAreas.push(x);
      })
    );
    return task;
  }

  async initializeMoistureMapping(
    task: InspectionTask
  ): Promise<InspectionTask> {
    task.environmentalForm.moistureMappingAreas.dateTesed = new Date();
    task.environmentalForm.moistureMappingAreas.dateTesedString = new Date().toISOString();
    task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.contactCode =
      bitrixMapping.Moisture.moistureHeader.contactCode;
    task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.inspectionTypeCode =
      bitrixMapping.Moisture.moistureHeader.inspectionTypeCode;
    task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.dateTesedCode =
      bitrixMapping.Moisture.moistureHeader.dateTesedCode;

    Promise.all(
      bitrixMapping.Moisture.areaCode.map((t, index) => {
        var x = new MoistureMapping();
        x.moistureMappingBitrixMap.areaCode =
          bitrixMapping.Moisture.areaCode[index];
        x.moistureMappingBitrixMap.areaOtherCode =
          bitrixMapping.Moisture.areaOtherCode[index];
        x.moistureMappingBitrixMap.areaCode =
          bitrixMapping.Moisture.areaCode[index];
        x.moistureMappingBitrixMap.roomTempCode =
          bitrixMapping.Moisture.roomTempCode[index];
        x.moistureMappingBitrixMap.relativeHumidityCode =
          bitrixMapping.Moisture.relativeHumidityCode[index];
        x.moistureMappingBitrixMap.dewPointCode =
          bitrixMapping.Moisture.dewPointCode[index];
        x.moistureMappingBitrixMap.standardTemperatureNorthCode =
          bitrixMapping.Moisture.standardTemperatureNorthCode[index];
        x.moistureMappingBitrixMap.standardTemperatureWestCode =
          bitrixMapping.Moisture.standardTemperatureWestCode[index];
        x.moistureMappingBitrixMap.standardTemperatureSouthCode =
          bitrixMapping.Moisture.standardTemperatureSouthCode[index];
        x.moistureMappingBitrixMap.standardTemperatureEastCode =
          bitrixMapping.Moisture.standardTemperatureEastCode[index];
        x.moistureMappingBitrixMap.standardTemperatureCeilingCode =
          bitrixMapping.Moisture.standardTemperatureCeilingCode[index];
        x.moistureMappingBitrixMap.standardTemperatureFloorCode =
          bitrixMapping.Moisture.standardTemperatureFloorCode[index];

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
      index < bitrixMapping[damageType].areasMoldBitrixCode.length;
      index++
    ) {
      var x = new DamageInspection(damageType);
      x.damageInspectionBitrixMapping.areaNameCode =
        bitrixMapping[damageType].areasMoldBitrixCode[index];
      x.damageInspectionBitrixMapping.areaNameOtherCode =
        bitrixMapping[damageType].areaNameOtherCode[index];
      x.damageInspectionBitrixMapping.conditionCode =
        bitrixMapping[damageType].areasMoldConditionBitrixCode[index];
      x.damageInspectionBitrixMapping.areaRHCode =
        bitrixMapping[damageType].areaRHCodeMold[index];
      x.damageInspectionBitrixMapping.areaPicturesCode =
        bitrixMapping[damageType].areaPicturesCodeMold[index];
      x.damageInspectionBitrixMapping.areaNotesCode =
        bitrixMapping[damageType].areaNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeCeilingCode =
        bitrixMapping[damageType].removeCeilingCodeMold[index];
      x.damageInspectionBitrixMapping.ceilingNotesCode =
        bitrixMapping[damageType].ceilingNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeDrywallCode =
        bitrixMapping[damageType].removeDrywallCodeMold[index];
      x.damageInspectionBitrixMapping.drywallNotesCode =
        bitrixMapping[damageType].drywallNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeBaseboardsCode =
        bitrixMapping[damageType].removeBaseboardsCodeMold[index];
      x.damageInspectionBitrixMapping.baseboardsNotesCode =
        bitrixMapping[damageType].baseboardsNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeFlooringCode =
        bitrixMapping[damageType].removeFlooringCodeMold[index];
      x.damageInspectionBitrixMapping.flooringNotesCode =
        bitrixMapping[damageType].flooringNotesCodeMold[index];
      x.damageInspectionBitrixMapping.decontaminationCode =
        bitrixMapping[damageType].decontaminationCodeMold[index];
      x.damageInspectionBitrixMapping.furnitureOptionCode =
        bitrixMapping[damageType].furnitureOptionCodeMold[index];
      x.damageInspectionBitrixMapping.beddingsOptionCode =
        bitrixMapping[damageType].beddingsOptionCodeMold[index];
      x.damageInspectionBitrixMapping.observationsCode =
        bitrixMapping[damageType].observationsCodeMold[index];

      x.areaPictures.bitrixTargeCode =
        bitrixMapping[damageType].areaPicturesCodeMold[index];

      x.damageInspectionBitrixMapping.recomendationsCode =
        bitrixMapping[damageType].recomendationsCodeMold[index];

      var s = new Sample(damageType);
      s.sampleBitrixMapping.sampleTypeCode =
        bitrixMapping[damageType].sampleTypeCodeSample1Mold[index];
      s.sampleBitrixMapping.labResultCode =
        bitrixMapping[damageType].labResultCodeSample1Mold[index];
      if (damageType == DamageAreaType.Mold) {
        s.sampleBitrixMapping.volumeCode =
          bitrixMapping[damageType].volumeCodeSample1Mold[index];
        s.sampleBitrixMapping.cassetteNumberCode =
          bitrixMapping[damageType].cassetteNumberCodeSample1Mold[index];
        s.sampleBitrixMapping.toxicMoldCode =
          bitrixMapping[damageType].toxicMoldCodeSample1Mold[index];

        s.sampleBitrixMapping.areaSwabCode =
          bitrixMapping[damageType].areaSwabCodeSample1Mold[index];
        s.sampleBitrixMapping.moldSporesFoundCode =
          bitrixMapping[damageType].moldSporesFoundCodeSample1Mold[index];
      }

      var s2 = new Sample(damageType);
      s2.sampleBitrixMapping.sampleTypeCode =
        bitrixMapping[damageType].sampleTypeCodeSample2Mold[index];
      s2.sampleBitrixMapping.labResultCode =
        bitrixMapping[damageType].labResultCodeSample2Mold[index];
      if (damageType == DamageAreaType.Mold) {
        s2.sampleBitrixMapping.volumeCode =
          bitrixMapping[damageType].volumeCodeSample2Mold[index];
        s2.sampleBitrixMapping.cassetteNumberCode =
          bitrixMapping[damageType].cassetteNumberCodeSample2Mold[index];
        s2.sampleBitrixMapping.toxicMoldCode =
          bitrixMapping[damageType].toxicMoldCodeSample2Mold[index];
        s.sampleBitrixMapping.areaSwabCode =
          bitrixMapping[damageType].areaSwabCodeSample2Mold[index];
        s.sampleBitrixMapping.moldSporesFoundCode =
          bitrixMapping[damageType].moldSporesFoundCodeSample2Mold[index];
      }

      var s3 = new Sample(damageType);
      s3.sampleBitrixMapping.sampleTypeCode =
        bitrixMapping[damageType].sampleTypeCodeSample3Mold[index];
      s3.sampleBitrixMapping.labResultCode =
        bitrixMapping[damageType].labResultCodeSample3Mold[index];
      if (damageType == DamageAreaType.Mold) {
        s3.sampleBitrixMapping.volumeCode =
          bitrixMapping[damageType].volumeCodeSample3Mold[index];
        s3.sampleBitrixMapping.cassetteNumberCode =
          bitrixMapping[damageType].cassetteNumberCodeSample3Mold[index];
        s3.sampleBitrixMapping.toxicMoldCode =
          bitrixMapping[damageType].toxicMoldCodeSample3Mold[index];
        s.sampleBitrixMapping.areaSwabCode =
          bitrixMapping[damageType].areaSwabCodeSample3Mold[index];
        s.sampleBitrixMapping.moldSporesFoundCode =
          bitrixMapping[damageType].moldSporesFoundCodeSample3Mold[index];
      }

      x.samples.push(s);
      x.samples.push(s2);
      x.samples.push(s3);

      listDamageInspection.push(x);
    }

    switch (damageType) {
      case DamageAreaType.Mold:
        task.environmentalForm.moldAreas.areasInspection = listDamageInspection;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.contactIdCode =
          bitrixMapping.Mold.inspectionHeader.contactIdCode;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.dealIdCode =
          bitrixMapping.Mold.inspectionHeader.dealIdCode;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.inspectionType =
          bitrixMapping.Mold.inspectionHeader.inspectionType;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.startDateCode =
          bitrixMapping.Mold.inspectionHeader.startDateCode;

        break;
      case DamageAreaType.Bacteria:
        task.environmentalForm.bacteriasAreas.areasInspection = listDamageInspection;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.contactIdCode =
          bitrixMapping.Bacteria.inspectionHeader.contactIdCode;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.dealIdCode =
          bitrixMapping.Bacteria.inspectionHeader.dealIdCode;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.inspectionType =
          bitrixMapping.Bacteria.inspectionHeader.inspectionType;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.startDateCode =
          bitrixMapping.Bacteria.inspectionHeader.startDateCode;
        break;
      case DamageAreaType.Soot:
        task.environmentalForm.sootAreas.areasInspection = listDamageInspection;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.contactIdCode =
          bitrixMapping.Soot.inspectionHeader.contactIdCode;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.dealIdCode =
          bitrixMapping.Soot.inspectionHeader.dealIdCode;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.inspectionType =
          bitrixMapping.Soot.inspectionHeader.inspectionType;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.startDateCode =
          bitrixMapping.Soot.inspectionHeader.startDateCode;

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

    var general = new GeneralInfoInspectionBitrixMapping();
    general.propertyYearCode = BitrixDealMapping.propertyYearCode;
    general.propertyTypeCode = BitrixDealMapping.propertyTypeCode;
    // general.environmentalInspectionCode =
    //   BitrixDealMapping.environmentalInspectionCode;
    general.interiorTemperatureCode = BitrixDealMapping.interiorTemperatureCode;
    general.exteriorRelativeHumidityCode =
      BitrixDealMapping.exteriorRelativeHumidityCode;
    general.HVACSystemConditionCode = BitrixDealMapping.HVACSystemConditionCode;
    general.ductsConditionCode = BitrixDealMapping.ductsConditionCode;
    general.atticConditionCode = BitrixDealMapping.atticConditionCode;
    general.agreementSignedYesNoCode =
      BitrixDealMapping.agreementSignedYesNoCode;
    task.environmentalForm.generalInfoInspection.generalInfoInspectionBitrixMapping = general;
    task.environmentalForm.generalInfoInspection.picturesFrontHouse.bitrixTargeCode =
      BitrixDealMapping.picturesFrontHouseCode;
    task.environmentalForm.generalInfoInspection.pictureHouseNumbers.bitrixTargeCode =
      BitrixDealMapping.pictureHouseNumbersCode;

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
    await this.inspectorsService.clear();
    var result = await this.bitrix.getInspectors();
    if (result.result) {
      usersList = result.result.map((x) => {
        return new User(x);
      });

      await this.inspectorsService.addItems(usersList);
    } else {
      console.log(result);
    }

    return usersList;
  }

  async getEnvironmentalFromServerInspectionFields(): Promise<any> {
    var responseMold = await this.bitrix.getEnvironmentalInspectionListsFields(
      48
    );
    var responseBacteria = await this.bitrix.getEnvironmentalInspectionListsFields(
      50
    );
    var responseSoot = await this.bitrix.getEnvironmentalInspectionListsFields(
      52
    );

    var responseMoisture = await this.bitrix.getEnvironmentalInspectionListsFields(
      34
    );
    var responseAsbestos = await this.bitrix.getEnvironmentalInspectionListsFields(
      32
    );

    var responseLeads = await this.bitrix.getEnvironmentalInspectionListsFields(
      30
    );
    let obj = Object.assign(
      responseMold.result,
      responseBacteria.result,
      responseSoot.result,
      responseMoisture.result,
      responseAsbestos.result,
      responseLeads.result
    );
    await this.environmentalInspectionFieldsListService.clear();
    await this.environmentalInspectionFieldsListService.add(obj);
    return await this.environmentalInspectionFieldsListService.getAll();
  }

  async getDealsFields(): Promise<any> {
    var list = await this.dealsFieldsListService.getAll();

    if (list != null) {
      return list;
    }

    await this.getDealsFieldsFromServer();
    return await this.dealsFieldsListService.getAll();
  }
  async getDealsFieldsFromServer(): Promise<any> {
    var reponseFields = await this.bitrix.getDealFields();
    await this.dealsFieldsListService.clear();
    await this.dealsFieldsListService.add(reponseFields.result);
    return await this.dealsFieldsListService.getAll();
  }

  async getExternal(idUser: number) {
    this.storage.set(SYNCSTAMPKEY, new Date());

    var startedList = await this.getStartedInspections();

    var list = await this.getInspectionITestJson(idUser);
    for (let index = 0; index < list.length; index++) {
      var item = list[index] as InspectionTask;
      item.internalStatus = InspectionStatus.New;

      var itemStarted: InspectionTask = null;
      if (startedList != null && startedList.length > 0) {
        itemStarted = startedList.find((x) => {
          return x.id === item.id;
        });
      }

      if (itemStarted) {
        item.comprehesiveForm = itemStarted.comprehesiveForm;

        item.iTestAgreements = itemStarted.iTestAgreements;
        item.expertNetworkAgreements = itemStarted.expertNetworkAgreements;
        item.internalStatus = itemStarted.internalStatus;
        item.bitrixFolder = itemStarted.bitrixFolder;

        itemStarted.environmentalForm.generalInfoInspection.propertyYear = itemStarted
          .environmentalForm.generalInfoInspection.propertyYear
          ? itemStarted.environmentalForm.generalInfoInspection.propertyYear
          : item.environmentalForm.generalInfoInspection.propertyYear;
        itemStarted.environmentalForm.generalInfoInspection.propertyType = itemStarted
          .environmentalForm.generalInfoInspection.propertyType
          ? itemStarted.environmentalForm.generalInfoInspection.propertyType
          : item.environmentalForm.generalInfoInspection.propertyType;
        itemStarted.environmentalForm.generalInfoInspection.environmentalInspection = itemStarted
          .environmentalForm.generalInfoInspection.environmentalInspection
          ? itemStarted.environmentalForm.generalInfoInspection
              .environmentalInspection
          : item.environmentalForm.generalInfoInspection
              .environmentalInspection;
        itemStarted.environmentalForm.generalInfoInspection.interiorTemperature = itemStarted
          .environmentalForm.generalInfoInspection.interiorTemperature
          ? itemStarted.environmentalForm.generalInfoInspection
              .interiorTemperature
          : item.environmentalForm.generalInfoInspection.interiorTemperature;
        itemStarted.environmentalForm.generalInfoInspection.exteriorRelativeHumidity = itemStarted
          .environmentalForm.generalInfoInspection.exteriorRelativeHumidity
          ? itemStarted.environmentalForm.generalInfoInspection
              .exteriorRelativeHumidity
          : item.environmentalForm.generalInfoInspection
              .exteriorRelativeHumidity;
        itemStarted.environmentalForm.generalInfoInspection.HVACSystemCondition = itemStarted
          .environmentalForm.generalInfoInspection.HVACSystemCondition
          ? itemStarted.environmentalForm.generalInfoInspection
              .HVACSystemCondition
          : item.environmentalForm.generalInfoInspection.HVACSystemCondition;
        itemStarted.environmentalForm.generalInfoInspection.ductsCondition = itemStarted
          .environmentalForm.generalInfoInspection.ductsCondition
          ? itemStarted.environmentalForm.generalInfoInspection.ductsCondition
          : item.environmentalForm.generalInfoInspection.ductsCondition;
        itemStarted.environmentalForm.generalInfoInspection.atticCondition = itemStarted
          .environmentalForm.generalInfoInspection.atticCondition
          ? itemStarted.environmentalForm.generalInfoInspection.atticCondition
          : item.environmentalForm.generalInfoInspection.atticCondition;

        item.environmentalForm = itemStarted.environmentalForm;
      }
      list[index] = item;
    }

    await Promise.all(
      startedList.map(async (element) => {
        if (!list.find((x) => x.id == element.id)) {
          list.push(element);
        }
      })
    );

    await this.inspectionStorage.clear();
    return this.inspectionStorage.addItems(list);
  }

  async refreshFieldsFromServer(idUser: number) {
    //await this.getExternal(idUser);
    await this.getEnvironmentalFromServerInspectionFields();
    await this.getDealsFieldsFromServer();
    await this.getInspectors(true);
  }
  async getSyncStamp() {
    return await this.storage.get(SYNCSTAMPKEY);
  }

  async getBitrixContact(contactId: string): Promise<Contact> {
    var bitrixContact: Contact = new Contact();
    try {
      var contact = await this.bitrix.getContact(contactId);
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
      var company = await this.bitrix.getCompanyContact(companyId);
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

  async getInspectionITestJson(idUser: number): Promise<InspectionTask[]> {
    try {
      var subtypes = await this.getInspectionTasksTypesList();
      var data = await this.bitrix.getInspectionsDeals(idUser);

      if (data.result.length > 0) {
        var list: InspectionTask[] = await Promise.all(
          data.result.map(
            async (x): Promise<InspectionTask> => {
              var taskContact = await this.getBitrixContact(x.CONTACT_ID);

              var task = await this.initializeEnvironmentalTask(
                new InspectionTask()
              );

              task.id = x.ID;
              task.contactId = x.CONTACT_ID;
              task.contactName =
                taskContact.firstName + " " + taskContact.lastName;

              task.title = x.TITLE;
              task.scheduleDateTime = new Date(x.UF_CRM_1612683055);
              task.scheduleDay = new Date(
                task.scheduleDateTime.getFullYear(),
                task.scheduleDateTime.getMonth(),
                task.scheduleDateTime.getDate()
              );

              task.serviceAddress = x.UF_CRM_1606466289;
              task.environmentalForm.generalInfoInspection.propertyYear =
                x[BitrixDealMapping.propertyYearCode];
              task.environmentalForm.generalInfoInspection.propertyType =
                x[BitrixDealMapping.propertyTypeCode];
              task.environmentalForm.generalInfoInspection.interiorTemperature =
                x[BitrixDealMapping.interiorTemperatureCode];
              task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity =
                x[BitrixDealMapping.exteriorRelativeHumidityCode];
              task.environmentalForm.generalInfoInspection.HVACSystemCondition =
                x[BitrixDealMapping.HVACSystemConditionCode];
              task.environmentalForm.generalInfoInspection.ductsCondition =
                x[BitrixDealMapping.ductsConditionCode];
              task.environmentalForm.generalInfoInspection.atticCondition =
                x[BitrixDealMapping.atticConditionCode];
              task.environmentalForm.generalInfoInspection.atticCondition =
                x[BitrixDealMapping.atticConditionCode];
              task.typeOfLossDesc = x[BitrixDealMapping.typesOfLoss];
              task.affectedArea = x[BitrixDealMapping.affectedArea];
              task.waterDamageCategory =
                x[BitrixDealMapping.waterDamageCategory];
              task.waterDamageClass = x[BitrixDealMapping.waterDamageClass];

              var address = task.serviceAddress.split("|");

              if (address.length > 1) {
                task.serviceAddress = address[0];
                task.geoPointText = address[1].replace(";", ",");
              }

              task.phone = taskContact.phone;
              task.email = taskContact.email;

              if (
                Array.isArray(x.UF_CRM_1612691342) &&
                x.UF_CRM_1612691342.length > 0
              ) {
                await Promise.all(
                  x.UF_CRM_1612691342.map(async (element: string) => {
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
                  })
                );
              }

              if (
                Array.isArray(x.UF_CRM_1612691326) &&
                x.UF_CRM_1612691326.length > 0
              ) {
                await Promise.all(
                  x.UF_CRM_1612691326.map(async (element: string) => {
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
                  })
                );
              }

              task.inspectorUserId = x.UF_CRM_1612682994;
              task.inspectionType = InspectionType.Environmental;
              task.inspectionSubTypes = x.UF_CRM_1612433280.map((m) => {
                if (m != 120) {
                  return subtypes.find((y) => y.id == m);
                }
              });
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
              task.inspectionsInstructions = x.UF_CRM_1612683023;
              task.internalStatus = InspectionStatus.New;

              return Promise.resolve(task);
            }
          )
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
