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
import { GeneralInfoInspectionBitrixMapping } from "../models/comprehensive-form/general-info-inspection";
const SYNCSTAMPKEY = "inspection-stamp-key";
@Injectable({
  providedIn: "root",
})
export class ItestDealService {
  environmentalInspectionFieldsName: string = "environmental-inspection-fields";
  dealFieldName: string = "deals-fields";
  collectionTaskSubTypesName: string = "task-itest-subtypes-list";

  inspectionTypesListService = new GenericStorageService(
    this.collectionTaskSubTypesName,
    this.storage
  );

  environmentalInspectionFieldsListService = new GenericStorageService(
    this.environmentalInspectionFieldsName,
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
  async getPendingInspections() {
    var list = await this.inspectionStorage.getAll();
    var pending;
    if (list != null) {
      pending = list
        .filter((item) => {
          return (
            item.internalStatus === InspectionStatus.New ||
            item.internalStatus === InspectionStatus.InProgress
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
          return (
            item.internalStatus !== InspectionStatus.New &&
            item.internalStatus !== InspectionStatus.InProgress
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

  async getStartedInspections() {
    var list = await this.inspectionStorage.getAll();
    if (list != null) {
      var completed = list
        .filter((item) => {
          return (
            item.internalStatus == InspectionStatus.Completed ||
            item.internalStatus == InspectionStatus.InProgress
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
    var result = await this.bitrix.getInspectionTypes();
    list = result.result.map((x) => {
      var subType = new TaskSubtype();
      subType.id = x.ID;
      subType.blockId = x.IBLOCK_ID;
      subType.name = x.NAME;
      return subType;
    });

    this.inspectionTypesListService.addItems(list);
    return list;
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
    var general = new GeneralInfoInspectionBitrixMapping();
    general.propertyYearCode = BitrixDealMapping.propertyYearCode;
    general.propertyTypeCode = BitrixDealMapping.propertyTypeCode;
    general.environmentalInspectionCode =
      BitrixDealMapping.environmentalInspectionCode;
    general.interiorTemperatureCode = BitrixDealMapping.interiorTemperatureCode;
    general.exteriorRelativeHumidityCode =
      BitrixDealMapping.exteriorRelativeHumidityCode;
    general.HVACSystemConditionCode = BitrixDealMapping.HVACSystemConditionCode;
    general.ductsConditionCode = BitrixDealMapping.ductsConditionCode;
    general.atticConditionCode = BitrixDealMapping.atticConditionCode;
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
    var responseMold = await this.bitrix.getEnvironmentalInspectionListsFields(
      48
    );
    var responseBacteria = await this.bitrix.getEnvironmentalInspectionListsFields(
      50
    );
    var responseSoot = await this.bitrix.getEnvironmentalInspectionListsFields(
      52
    );
    let obj = Object.assign(
      responseMold.result,
      responseBacteria.result,
      responseSoot.result
    );

    await this.environmentalInspectionFieldsListService.add(obj);
    list = await this.environmentalInspectionFieldsListService.getAll();
    return list;
  }

  async getDealsFields(): Promise<any> {
    var list = await this.dealsFieldsListService.getAll();

    if (list != null) {
      return list;
    }
    var reponseFields = await this.bitrix.getDealFields();

    await this.dealsFieldsListService.add(reponseFields.result);
    list = await this.dealsFieldsListService.getAll();
    return list;
  }

  async getExternal(idUser: number) {
    this.storage.set(SYNCSTAMPKEY, new Date());

    var completed = await this.getStartedInspections();

    var list = await this.getInspectionITestJson(idUser);
    for (let index = 0; index < list.length; index++) {
      var item = list[index] as any;
      item.internalStatus = InspectionStatus.New;

      var itemCompleted = null;
      if (completed != null && completed.length > 0) {
        itemCompleted = completed.find((x) => {
          return x.id === item.id;
        });
      }

      list[index] = itemCompleted ? itemCompleted : item;
    }
    await this.inspectionStorage.clear();

    await this.getEnvironmentalInspectionFields();
    await this.getDealsFields();
    return this.inspectionStorage.addItems(list);
  }

  async getSyncStamp() {
    return await this.storage.get(SYNCSTAMPKEY);
  }

  async getInspectionITestJson(idUser: number): Promise<InspectionTask[]> {
    try {
      var subtypes = await this.getInspectionTasksTypesList();
      var data = await this.bitrix.getInspectionsDeals(idUser);

      if (data.result.length > 0) {
        var list: InspectionTask[] = await Promise.all(
          data.result.map(
            async (x): Promise<InspectionTask> => {
              var contact = await this.bitrix.getContact(x.CONTACT_ID);
              contact = contact.result;
              var task = new InspectionTask();

              task.id = x.ID;
              task.contactId = x.CONTACT_ID;
              task.title = x.TITLE;
              task.scheduleDateTime = new Date(x.UF_CRM_1612683055);
              task.scheduleDay = new Date(
                task.scheduleDateTime.getFullYear(),
                task.scheduleDateTime.getMonth(),
                task.scheduleDateTime.getDate()
              );
              task.contactName = contact.NAME + " " + contact.LAST_NAME;
              task.serviceAddress = x.UF_CRM_1606466289;

              var address = task.serviceAddress.split("|");

              if (address.length > 1) {
                task.serviceAddress = address[0];
                task.geoPointText = address[1].replace(";", ",");
              }

              if (Array.isArray(contact.PHONE) && contact.PHONE.length) {
                task.contactPhone = contact.PHONE[0].VALUE;
              }

              if (Array.isArray(contact.EMAIL) && contact.EMAIL.length) {
                task.contactEmail = contact.EMAIL[0].VALUE;
              }

              if (
                Array.isArray(x.UF_CRM_1612691326) &&
                x.UF_CRM_1612691326.length
              ) {
                await Promise.all(
                  x.UF_CRM_1612691326.map(async (element: string) => {
                    if (element.includes("C_")) {
                      var contactReference = await this.bitrix.getContact(
                        Number.parseInt(element.split("C_")[1])
                      );
                      if (contactReference && contactReference.result) {
                        contactReference = contactReference.result;
                        task.referalPartnerContact =
                          contactReference.NAME +
                          " " +
                          contactReference.LAST_NAME;
                      }
                    }
                    if (element.includes("CO_")) {
                      var companyReference = await this.bitrix.getCompanyContact(
                        Number.parseInt(element.split("CO_")[1])
                      );
                      if (companyReference && companyReference.result) {
                        task.referalPartnerCompany =
                          companyReference.result.TITLE;
                      }
                    }
                  })
                );
              }

              task.inspectorUserId = x.UF_CRM_1612682994;
              task.inspectionType = InspectionType.Environmental;
              task.inspectionSubTypes = x.UF_CRM_1612433280.map((m) => {
                return subtypes.find((y) => y.id == m);
              });
              task.inspectionSubTypesString = task.inspectionSubTypes
                .map((type) => {
                  return type.name;
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
