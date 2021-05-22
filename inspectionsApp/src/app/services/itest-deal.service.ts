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
import { ComprehensiveForm } from "../models/comprehensive-form/comprehensive-form";
import { Area } from "../models/comprehensive-form/area";
import {
  GeneralCondition,
  GeneralConditionBitrixMapping,
} from "../models/comprehensive-form/general-condition";
import { Kitchen } from "../models/comprehensive-form/kitchen";
import { EnvironmentalSectionBitrixMapping } from "../models/comprehensive-form/comprehensive-environmental-section";
import { RecomendationsBitrixMapping } from "../models/comprehensive-form/recomendations";
import { InsuranceBitrixMapping } from "../models/comprehensive-form/insurance";
import { RemindersBitrixMapping } from "../models/comprehensive-form/reminders";
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
    task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionDateCode =
      bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionDateCode;
    task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.contactCode =
      bitrixMappingEnvironmental.Asbestos.asbestosHeader.contactCode;
    task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionTypeCode =
      bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionTypeCode;

    Promise.all(
      bitrixMappingEnvironmental.Asbestos.materialLocationCode.map(
        (t, index) => {
          var x = new Asbesto();

          x.asbestoBitrixMaping.materialLocationCode =
            bitrixMappingEnvironmental.Asbestos.materialLocationCode[index];
          x.asbestoBitrixMaping.materialLocationOtherCode =
            bitrixMappingEnvironmental.Asbestos.materialLocationOtherCode[
              index
            ];
          x.asbestoBitrixMaping.materialDescriptionCode =
            bitrixMappingEnvironmental.Asbestos.materialDescriptionCode[index];
          x.asbestoBitrixMaping.totalQuantityCode =
            bitrixMappingEnvironmental.Asbestos.totalQuantityCode[index];
          x.asbestoBitrixMaping.F_NFCode =
            bitrixMappingEnvironmental.Asbestos.F_NFCode[index];
          x.asbestoBitrixMaping.conditionCode =
            bitrixMappingEnvironmental.Asbestos.conditionCode[index];
          x.asbestoBitrixMaping.labResultsCode =
            bitrixMappingEnvironmental.Asbestos.labResultsCode[index];
          x.asbestoBitrixMaping.observationsCode =
            bitrixMappingEnvironmental.Asbestos.observationsCode[index];

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
    task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionDateCode =
      bitrixMappingEnvironmental.Lead.leadHeader.inspectionDateCode;
    task.environmentalForm.leadAreas.leadAreasBitrixMapping.contactCode =
      bitrixMappingEnvironmental.Lead.leadHeader.contactCode;
    task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionTypeCode =
      bitrixMappingEnvironmental.Lead.leadHeader.inspectionTypeCode;
    Promise.all(
      bitrixMappingEnvironmental.Lead.sampleCode.map((t, index) => {
        var x = new Lead();
        x.bitrixMappingLead.sampleCode =
          bitrixMappingEnvironmental.Lead.sampleCode[index];
        x.bitrixMappingLead.sampleOtherCode =
          bitrixMappingEnvironmental.Lead.sampleOtherCode[index];
        x.bitrixMappingLead.cardinalDirectionCode =
          bitrixMappingEnvironmental.Lead.cardinalDirectionCode[index];
        x.bitrixMappingLead.dimensionCm2Code =
          bitrixMappingEnvironmental.Lead.dimensionCm2Code[index];
        x.bitrixMappingLead.materialCode =
          bitrixMappingEnvironmental.Lead.materialCode[index];
        x.bitrixMappingLead.typeOfSampleCode =
          bitrixMappingEnvironmental.Lead.typeOfSampleCode[index];
        x.bitrixMappingLead.labResultsCode =
          bitrixMappingEnvironmental.Lead.labResultsCode[index];
        x.bitrixMappingLead.observationsCode =
          bitrixMappingEnvironmental.Lead.observationsCode[index];

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
        x.areaBitrixMapping.nameCode =
          bitrixMappingComprehensive.Area.nameCode[index];
        x.areaBitrixMapping.conditionCode =
          bitrixMappingComprehensive.Area.conditionCode[index];
        x.areaBitrixMapping.moistureLevelCode =
          bitrixMappingComprehensive.Area.moistureLevelCode[index];
        x.areaBitrixMapping.picturesCode =
          bitrixMappingComprehensive.Area.picturesCode[index];
        x.areaBitrixMapping.notesCode =
          bitrixMappingComprehensive.Area.notesCode[index];
        task.comprehesiveForm.areas.push(x);
      }),
      bitrixMappingComprehensive.Bathrooms.conditionCode.map((x, index) => {
        var area = new GeneralCondition();
        area.generalConditionBitrixMapping.conditionCode =
          bitrixMappingComprehensive.Bathrooms.conditionCode[index];
        area.generalConditionBitrixMapping.moistureLevelCode =
          bitrixMappingComprehensive.Bathrooms.moistureLevelCode[index];
        area.generalConditionBitrixMapping.picturesCode =
          bitrixMappingComprehensive.Bathrooms.picturesCode[index];
        area.generalConditionBitrixMapping.notesCode =
          bitrixMappingComprehensive.Bathrooms.notesCode[index];
        task.comprehesiveForm.bathrooms.push(area);
      }),
    ]);
    var kitchen = new GeneralConditionBitrixMapping();
    kitchen.conditionCode = bitrixMappingComprehensive.Kitchen.conditionCode;
    kitchen.moistureLevelCode =
      bitrixMappingComprehensive.Kitchen.moistureLevelCode;
    kitchen.picturesCode = bitrixMappingComprehensive.Kitchen.picturesCode;
    kitchen.notesCode = bitrixMappingComprehensive.Kitchen.notesCode;
    kitchen.waterQualityTestCode =
      bitrixMappingComprehensive.Kitchen.waterQualityTestCode;
    task.comprehesiveForm.kitchen.generalConditionBitrixMapping = kitchen;

    kitchen.conditionCode = bitrixMappingComprehensive.Kitchen.conditionCode;
    kitchen.moistureLevelCode =
      bitrixMappingComprehensive.Kitchen.moistureLevelCode;
    kitchen.picturesCode = bitrixMappingComprehensive.Kitchen.picturesCode;
    kitchen.notesCode = bitrixMappingComprehensive.Kitchen.notesCode;
    kitchen.waterQualityTestCode =
      bitrixMappingComprehensive.Kitchen.waterQualityTestCode;
    task.comprehesiveForm.kitchen.generalConditionBitrixMapping = kitchen;
    //HVAC_AC
    var HVAC_AC = new GeneralConditionBitrixMapping();
    HVAC_AC.conditionCode = bitrixMappingComprehensive.HVAC_AC.conditionCode;
    HVAC_AC.moistureLevelCode =
      bitrixMappingComprehensive.HVAC_AC.moistureLevelCode;
    HVAC_AC.picturesCode = bitrixMappingComprehensive.HVAC_AC.picturesCode;
    HVAC_AC.notesCode = bitrixMappingComprehensive.HVAC_AC.notesCode;
    task.comprehesiveForm.HVAC_AC.generalConditionBitrixMapping = HVAC_AC;

    //utilityRoom
    var utilityRoom = new GeneralConditionBitrixMapping();
    utilityRoom.conditionCode =
      bitrixMappingComprehensive.UtilityRoom.conditionCode;
    utilityRoom.moistureLevelCode =
      bitrixMappingComprehensive.UtilityRoom.moistureLevelCode;
    utilityRoom.picturesCode =
      bitrixMappingComprehensive.UtilityRoom.picturesCode;
    utilityRoom.notesCode = bitrixMappingComprehensive.UtilityRoom.notesCode;
    task.comprehesiveForm.utilityRoom.generalConditionBitrixMapping =
      utilityRoom;
    //atic
    var attic = new GeneralConditionBitrixMapping();
    attic.conditionCode = bitrixMappingComprehensive.Attic.conditionCode;
    attic.moistureLevelCode =
      bitrixMappingComprehensive.Attic.moistureLevelCode;
    attic.picturesCode = bitrixMappingComprehensive.Attic.picturesCode;
    attic.notesCode = bitrixMappingComprehensive.Attic.notesCode;
    task.comprehesiveForm.atic.generalConditionBitrixMapping = attic;
    //exterior
    var exterior = new GeneralConditionBitrixMapping();
    exterior.conditionCode = bitrixMappingComprehensive.Exterior.conditionCode;
    exterior.otherCode = bitrixMappingComprehensive.Exterior.otherCode;
    exterior.moistureLevelCode =
      bitrixMappingComprehensive.Exterior.moistureLevelCode;
    exterior.picturesCode = bitrixMappingComprehensive.Exterior.picturesCode;
    exterior.notesCode = bitrixMappingComprehensive.Exterior.notesCode;
    task.comprehesiveForm.exterior.generalConditionBitrixMapping = exterior;

    //environmentalSection
    var environmental = new EnvironmentalSectionBitrixMapping();
    environmental.MoldSampleTakenCode =
      bitrixMappingComprehensive.EnvironmentalSection.MoldSampleTakenCode;
    environmental.MoldSampleLocationCode =
      bitrixMappingComprehensive.EnvironmentalSection.MoldSampleLocationCode;
    environmental.MoldLocationPictureCode =
      bitrixMappingComprehensive.EnvironmentalSection.MoldLocationPictureCode;
    environmental.WaterSampleTakenCode =
      bitrixMappingComprehensive.EnvironmentalSection.WaterSampleTakenCode;
    environmental.WaterSamplelocationCode =
      bitrixMappingComprehensive.EnvironmentalSection.WaterSamplelocationCode;
    environmental.MajorReconstructionCode =
      bitrixMappingComprehensive.EnvironmentalSection.MajorReconstructionCode;
    task.comprehesiveForm.enviromentalSection.environmentalSectionBitrixMapping =
      environmental;

    //Recomendations
    var recomendations = new RecomendationsBitrixMapping();
    recomendations.damagesFoundCode =
      bitrixMappingComprehensive.Recomendations.damagesFoundCode;
    recomendations.inspectionRecomendationCode =
      bitrixMappingComprehensive.Recomendations.inspectionRecomendationCode;
    recomendations.recomendationCode =
      bitrixMappingComprehensive.Recomendations.recomendationCode;
    task.comprehesiveForm.recomendations.recomendationsBitrixMapping =
      recomendations;

    var reminders = new RemindersBitrixMapping();
    reminders.stickerCode = bitrixMappingComprehensive.Reminders.stickerCode;
    reminders.freeInspectionCode =
      bitrixMappingComprehensive.Reminders.freeInspectionCode;
    reminders.brochureCode = bitrixMappingComprehensive.Reminders.brochureCode;
    reminders.offerFinancingCode =
      bitrixMappingComprehensive.Reminders.offerFinancingCode;

    task.comprehesiveForm.reminders.remindersBitrixMapping = reminders;

    //Insurance
    var insurance = new InsuranceBitrixMapping();
    insurance.haveInsuranceCode =
      bitrixMappingComprehensive.Insurance.haveInsuranceCode;
    insurance.insuranceCarrierCode =
      bitrixMappingComprehensive.Insurance.insuranceCarrierCode;
    insurance.picturesPolicyCode =
      bitrixMappingComprehensive.Insurance.picturesPolicyCode;
    insurance.claimForDamageBeforeCode =
      bitrixMappingComprehensive.Insurance.claimForDamageBeforeCode;
    insurance.claimInLast5YearsCode =
      bitrixMappingComprehensive.Insurance.claimInLast5YearsCode;
    insurance.reasonForClaimCode =
      bitrixMappingComprehensive.Insurance.reasonForClaimCode;
    insurance.usePublicAdjusterCode =
      bitrixMappingComprehensive.Insurance.usePublicAdjusterCode;
    insurance.adjusterNameCode =
      bitrixMappingComprehensive.Insurance.adjusterNameCode;
    insurance.quantityOfChecksCode =
      bitrixMappingComprehensive.Insurance.quantityOfChecksCode;
    insurance.notesCode = bitrixMappingComprehensive.Insurance.notesCode;
    insurance.assignPAorAttorneyCode =
      bitrixMappingComprehensive.Insurance.assignPAorAttorneyCode;
    task.comprehesiveForm.insurance.insuranceBitrixMapping = insurance;

    return task;
  }

  async initializeMoistureMapping(
    task: InspectionTask
  ): Promise<InspectionTask> {
    task.environmentalForm.moistureMappingAreas.dateTesed = new Date();
    task.environmentalForm.moistureMappingAreas.dateTesedString =
      new Date().toISOString();
    task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.contactCode =
      bitrixMappingEnvironmental.Moisture.moistureHeader.contactCode;
    task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.inspectionTypeCode =
      bitrixMappingEnvironmental.Moisture.moistureHeader.inspectionTypeCode;
    task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.dateTesedCode =
      bitrixMappingEnvironmental.Moisture.moistureHeader.dateTesedCode;

    Promise.all(
      bitrixMappingEnvironmental.Moisture.areaCode.map((t, index) => {
        var x = new MoistureMapping();
        x.moistureMappingBitrixMap.areaCode =
          bitrixMappingEnvironmental.Moisture.areaCode[index];
        x.moistureMappingBitrixMap.areaOtherCode =
          bitrixMappingEnvironmental.Moisture.areaOtherCode[index];
        x.moistureMappingBitrixMap.areaCode =
          bitrixMappingEnvironmental.Moisture.areaCode[index];
        x.moistureMappingBitrixMap.roomTempCode =
          bitrixMappingEnvironmental.Moisture.roomTempCode[index];
        x.moistureMappingBitrixMap.relativeHumidityCode =
          bitrixMappingEnvironmental.Moisture.relativeHumidityCode[index];
        x.moistureMappingBitrixMap.dewPointCode =
          bitrixMappingEnvironmental.Moisture.dewPointCode[index];
        x.moistureMappingBitrixMap.standardTemperatureNorthCode =
          bitrixMappingEnvironmental.Moisture.standardTemperatureNorthCode[
            index
          ];
        x.moistureMappingBitrixMap.standardTemperatureWestCode =
          bitrixMappingEnvironmental.Moisture.standardTemperatureWestCode[
            index
          ];
        x.moistureMappingBitrixMap.standardTemperatureSouthCode =
          bitrixMappingEnvironmental.Moisture.standardTemperatureSouthCode[
            index
          ];
        x.moistureMappingBitrixMap.standardTemperatureEastCode =
          bitrixMappingEnvironmental.Moisture.standardTemperatureEastCode[
            index
          ];
        x.moistureMappingBitrixMap.standardTemperatureCeilingCode =
          bitrixMappingEnvironmental.Moisture.standardTemperatureCeilingCode[
            index
          ];
        x.moistureMappingBitrixMap.standardTemperatureFloorCode =
          bitrixMappingEnvironmental.Moisture.standardTemperatureFloorCode[
            index
          ];

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
      index < bitrixMappingEnvironmental[damageType].areasMoldBitrixCode.length;
      index++
    ) {
      var x = new DamageInspection(damageType);
      x.damageInspectionBitrixMapping.areaNameCode =
        bitrixMappingEnvironmental[damageType].areasMoldBitrixCode[index];
      x.damageInspectionBitrixMapping.areaNameOtherCode =
        bitrixMappingEnvironmental[damageType].areaNameOtherCode[index];
      x.damageInspectionBitrixMapping.conditionCode =
        bitrixMappingEnvironmental[damageType].areasMoldConditionBitrixCode[
          index
        ];
      x.damageInspectionBitrixMapping.areaRHCode =
        bitrixMappingEnvironmental[damageType].areaRHCodeMold[index];
      x.damageInspectionBitrixMapping.areaPicturesCode =
        bitrixMappingEnvironmental[damageType].areaPicturesCodeMold[index];
      x.damageInspectionBitrixMapping.areaNotesCode =
        bitrixMappingEnvironmental[damageType].areaNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeCeilingCode =
        bitrixMappingEnvironmental[damageType].removeCeilingCodeMold[index];
      x.damageInspectionBitrixMapping.ceilingNotesCode =
        bitrixMappingEnvironmental[damageType].ceilingNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeDrywallCode =
        bitrixMappingEnvironmental[damageType].removeDrywallCodeMold[index];
      x.damageInspectionBitrixMapping.drywallNotesCode =
        bitrixMappingEnvironmental[damageType].drywallNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeBaseboardsCode =
        bitrixMappingEnvironmental[damageType].removeBaseboardsCodeMold[index];
      x.damageInspectionBitrixMapping.baseboardsNotesCode =
        bitrixMappingEnvironmental[damageType].baseboardsNotesCodeMold[index];
      x.damageInspectionBitrixMapping.removeFlooringCode =
        bitrixMappingEnvironmental[damageType].removeFlooringCodeMold[index];
      x.damageInspectionBitrixMapping.flooringNotesCode =
        bitrixMappingEnvironmental[damageType].flooringNotesCodeMold[index];
      x.damageInspectionBitrixMapping.decontaminationCode =
        bitrixMappingEnvironmental[damageType].decontaminationCodeMold[index];
      x.damageInspectionBitrixMapping.furnitureOptionCode =
        bitrixMappingEnvironmental[damageType].furnitureOptionCodeMold[index];
      x.damageInspectionBitrixMapping.beddingsOptionCode =
        bitrixMappingEnvironmental[damageType].beddingsOptionCodeMold[index];
      x.damageInspectionBitrixMapping.observationsCode =
        bitrixMappingEnvironmental[damageType].observationsCodeMold[index];

      x.areaPictures.bitrixTargeCode =
        bitrixMappingEnvironmental[damageType].areaPicturesCodeMold[index];

      x.damageInspectionBitrixMapping.recomendationsCode =
        bitrixMappingEnvironmental[damageType].recomendationsCodeMold[index];

      var s = new Sample(damageType);
      s.sampleBitrixMapping.sampleTypeCode =
        bitrixMappingEnvironmental[damageType].sampleTypeCodeSample1Mold[index];
      s.sampleBitrixMapping.labResultCode =
        bitrixMappingEnvironmental[damageType].labResultCodeSample1Mold[index];
      if (damageType == DamageAreaType.Mold) {
        s.sampleBitrixMapping.volumeCode =
          bitrixMappingEnvironmental[damageType].volumeCodeSample1Mold[index];
        s.sampleBitrixMapping.cassetteNumberCode =
          bitrixMappingEnvironmental[damageType].cassetteNumberCodeSample1Mold[
            index
          ];
        s.sampleBitrixMapping.toxicMoldCode =
          bitrixMappingEnvironmental[damageType].toxicMoldCodeSample1Mold[
            index
          ];

        s.sampleBitrixMapping.areaSwabCode =
          bitrixMappingEnvironmental[damageType].areaSwabCodeSample1Mold[index];
        s.sampleBitrixMapping.moldSporesFoundCode =
          bitrixMappingEnvironmental[damageType].moldSporesFoundCodeSample1Mold[
            index
          ];
      }

      var s2 = new Sample(damageType);
      s2.sampleBitrixMapping.sampleTypeCode =
        bitrixMappingEnvironmental[damageType].sampleTypeCodeSample2Mold[index];
      s2.sampleBitrixMapping.labResultCode =
        bitrixMappingEnvironmental[damageType].labResultCodeSample2Mold[index];
      if (damageType == DamageAreaType.Mold) {
        s2.sampleBitrixMapping.volumeCode =
          bitrixMappingEnvironmental[damageType].volumeCodeSample2Mold[index];
        s2.sampleBitrixMapping.cassetteNumberCode =
          bitrixMappingEnvironmental[damageType].cassetteNumberCodeSample2Mold[
            index
          ];
        s2.sampleBitrixMapping.toxicMoldCode =
          bitrixMappingEnvironmental[damageType].toxicMoldCodeSample2Mold[
            index
          ];
        s.sampleBitrixMapping.areaSwabCode =
          bitrixMappingEnvironmental[damageType].areaSwabCodeSample2Mold[index];
        s.sampleBitrixMapping.moldSporesFoundCode =
          bitrixMappingEnvironmental[damageType].moldSporesFoundCodeSample2Mold[
            index
          ];
      }

      var s3 = new Sample(damageType);
      s3.sampleBitrixMapping.sampleTypeCode =
        bitrixMappingEnvironmental[damageType].sampleTypeCodeSample3Mold[index];
      s3.sampleBitrixMapping.labResultCode =
        bitrixMappingEnvironmental[damageType].labResultCodeSample3Mold[index];
      if (damageType == DamageAreaType.Mold) {
        s3.sampleBitrixMapping.volumeCode =
          bitrixMappingEnvironmental[damageType].volumeCodeSample3Mold[index];
        s3.sampleBitrixMapping.cassetteNumberCode =
          bitrixMappingEnvironmental[damageType].cassetteNumberCodeSample3Mold[
            index
          ];
        s3.sampleBitrixMapping.toxicMoldCode =
          bitrixMappingEnvironmental[damageType].toxicMoldCodeSample3Mold[
            index
          ];
        s.sampleBitrixMapping.areaSwabCode =
          bitrixMappingEnvironmental[damageType].areaSwabCodeSample3Mold[index];
        s.sampleBitrixMapping.moldSporesFoundCode =
          bitrixMappingEnvironmental[damageType].moldSporesFoundCodeSample3Mold[
            index
          ];
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
          bitrixMappingEnvironmental.Mold.inspectionHeader.contactIdCode;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.dealIdCode =
          bitrixMappingEnvironmental.Mold.inspectionHeader.dealIdCode;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.inspectionType =
          bitrixMappingEnvironmental.Mold.inspectionHeader.inspectionType;
        task.environmentalForm.moldAreas.damageAreasBitrixMapping.startDateCode =
          bitrixMappingEnvironmental.Mold.inspectionHeader.startDateCode;

        break;
      case DamageAreaType.Bacteria:
        task.environmentalForm.bacteriasAreas.areasInspection =
          listDamageInspection;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.contactIdCode =
          bitrixMappingEnvironmental.Bacteria.inspectionHeader.contactIdCode;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.dealIdCode =
          bitrixMappingEnvironmental.Bacteria.inspectionHeader.dealIdCode;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.inspectionType =
          bitrixMappingEnvironmental.Bacteria.inspectionHeader.inspectionType;
        task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.startDateCode =
          bitrixMappingEnvironmental.Bacteria.inspectionHeader.startDateCode;
        break;
      case DamageAreaType.Soot:
        task.environmentalForm.sootAreas.areasInspection = listDamageInspection;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.contactIdCode =
          bitrixMappingEnvironmental.Soot.inspectionHeader.contactIdCode;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.dealIdCode =
          bitrixMappingEnvironmental.Soot.inspectionHeader.dealIdCode;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.inspectionType =
          bitrixMappingEnvironmental.Soot.inspectionHeader.inspectionType;
        task.environmentalForm.sootAreas.damageAreasBitrixMapping.startDateCode =
          bitrixMappingEnvironmental.Soot.inspectionHeader.startDateCode;

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
    general.propertyYearCode = ITestDealMapping.propertyYearCode;
    general.propertyTypeCode = ITestDealMapping.propertyTypeCode;
    // general.environmentalInspectionCode =
    //   BitrixDealMapping.environmentalInspectionCode;
    general.interiorTemperatureCode = ITestDealMapping.interiorTemperatureCode;
    general.exteriorRelativeHumidityCode =
      ITestDealMapping.exteriorRelativeHumidityCode;
    general.HVACSystemConditionCode = ITestDealMapping.HVACSystemConditionCode;
    general.ductsConditionCode = ITestDealMapping.ductsConditionCode;
    general.atticConditionCode = ITestDealMapping.atticConditionCode;

    general.typeOfLossDescCode = ITestDealMapping.typesOfLoss;
    general.affectedAreaCode = ITestDealMapping.affectedArea;
    general.waterDamageCategoryCode = ITestDealMapping.waterDamageCategory;
    general.waterDamageClassCode = ITestDealMapping.waterDamageClass;
    general.agreementSignedYesNoCode =
      ITestDealMapping.agreementSignedYesNoCode;
    task.environmentalForm.generalInfoInspection.generalInfoInspectionBitrixMapping =
      general;
    task.environmentalForm.generalInfoInspection.picturesFrontHouse.bitrixTargeCode =
      ITestDealMapping.picturesFrontHouseCode;
    task.environmentalForm.generalInfoInspection.pictureHouseNumbers.bitrixTargeCode =
      ITestDealMapping.pictureHouseNumbersCode;

    return task;
  }

  async initializeENTask(task: InspectionTask): Promise<InspectionTask> {
    if (!task.comprehesiveForm) {
      task.comprehesiveForm = new ComprehensiveForm();
    }
    //initialize mold Areas
    task = await this.initializeComprehensiveArea(task);

    var general = new GeneralInfoInspectionBitrixMapping();
    general.propertyYearCode = ENDealMapping.propertyYearCode;
    general.propertyTypeCode = ENDealMapping.propertyTypeCode;
    general.agreementSignedYesNoCode = ENDealMapping.agreementSignedYesNoCode;
    task.comprehesiveForm.generalInfoInspection.generalInfoInspectionBitrixMapping =
      general;
    task.comprehesiveForm.generalInfoInspection.picturesFrontHouse.bitrixTargeCode =
      ENDealMapping.picturesFrontHouseCode;
    task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers.bitrixTargeCode =
      ENDealMapping.pictureHouseNumbersCode;

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
    var result = await this.bitrixITest.getInspectors();
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
    await this.environmentalInspectionFieldsListService.clear();
    await this.environmentalInspectionFieldsListService.add(obj);
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
    await this.dealsFieldsListService.clear();
    await this.dealsFieldsListService.add(reponseFields.result);
    return await this.dealsFieldsListService.getAll();
  }

  async getExternal(user: User) {
    this.storage.set(SYNCSTAMPKEY, new Date());

    if (user.enterprise == EnumEnterprise.itest) {
      await this.RejectedInspection(user);
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
      item.internalStatus = InspectionStatus.New;

      var itemStarted: InspectionTask = null;
      if (startedList != null && startedList.length > 0) {
        itemStarted = startedList.find((x) => {
          return x.id === item.id;
        });
      }

      if (itemStarted) {
        item = await this.MergeStartedInspection(item, itemStarted);
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

  async MergeStartedInspection(
    item: InspectionTask,
    itemStarted: InspectionTask
  ): Promise<InspectionTask> {
    item.iTestAgreements = itemStarted.iTestAgreements;
    item.expertNetworkAgreements = itemStarted.expertNetworkAgreements;
    item.internalStatus = itemStarted.internalStatus;
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
    var data = await this.bitrixITest.getRejectedDeals(user);
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

  async getInspectionITestJson(user: User): Promise<InspectionTask[]> {
    try {
      var subtypes = await this.getInspectionTasksTypesList();
      var data = await this.bitrixITest.getInspectionsDeals(user);

      if (data.result.length > 0) {
        var list: InspectionTask[] = await Promise.all(
          data.result.map(async (x): Promise<InspectionTask> => {
            var taskContact = await this.getBitrixContact(x.CONTACT_ID);

            var task = await this.initializeEnvironmentalTask(
              new InspectionTask()
            );

            task.id = x.ID;
            task.contactId = x.CONTACT_ID;
            task.contactName =
              taskContact.firstName + " " + taskContact.lastName;

            task.title = x.TITLE;
            task.scheduleDateTime = new Date(x[ITestDealMapping.dealDateTime]);
            task.scheduleDay = new Date(
              task.scheduleDateTime.getFullYear(),
              task.scheduleDateTime.getMonth(),
              task.scheduleDateTime.getDate()
            );

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
            task.typeOfLossDesc = x[ITestDealMapping.typesOfLoss];
            task.affectedArea = x[ITestDealMapping.affectedArea];
            task.waterDamageCategory = x[ITestDealMapping.waterDamageCategory];
            task.waterDamageClass = x[ITestDealMapping.waterDamageClass];

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
