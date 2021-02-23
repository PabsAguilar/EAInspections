import { Injectable } from "@angular/core";
import { element } from "protractor";
import { Observable } from "rxjs";
import { DamageAreaType, InspectionStatus } from "../models/enums";
import { InspectionTask } from "../models/inspection-task";
import { BitrixItestService } from "./bitrix-itest.service";
import { InspectionsStorageService } from "./inspections-storage.service";

@Injectable({
  providedIn: "root",
})
export class SyncInspectionService {
  constructor(
    private bitrix: BitrixItestService,
    private inspectionStorage: InspectionsStorageService
  ) {}

  async syncTask(task: InspectionTask) {
    if (!task.environmentalForm.moldAreas.sync) {
      var result = await this.sendDamageInspection(
        task,
        DamageAreaType.Mold,
        48,
        "Mold Inspection - " + task.title
      );
      task.environmentalForm.moldAreas.sync = result;
    }
    if (!task.environmentalForm.bacteriasAreas.sync) {
      var result = await this.sendDamageInspection(
        task,
        DamageAreaType.Bacteria,
        50,
        "Bacteria Inspection - " + task.title
      );

      task.environmentalForm.bacteriasAreas.sync = result;
    }
    if (!task.environmentalForm.sootAreas.sync) {
      var result = await this.sendDamageInspection(
        task,
        DamageAreaType.Soot,
        52,
        "Soot Inspection - " + task.title
      );
      task.environmentalForm.sootAreas.sync = result;
    }

    if (
      task.environmentalForm.moldAreas.sync &&
      task.environmentalForm.bacteriasAreas.sync &&
      task.environmentalForm.sootAreas.sync &&
      true
    ) {
      task.internalStatus = InspectionStatus.Completed;
      this.inspectionStorage.update(task);
    } else {
      this.inspectionStorage.update(task);
    }
  }
  async sendDamageInspection(
    task: InspectionTask,
    type: string,
    list: number,
    name: string
  ): Promise<boolean> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: list,
        IBLOCK_TYPE_ID: "lists",
        ELEMENT_CODE:
          list + "-" + task.id + "-" + (Math.random() * 100).toString(),
        FIELDS: {
          NAME: name,
        },
      };
      var damageInspectionList = [];
      switch (type) {
        case DamageAreaType.Mold:
          damageInspectionList =
            task.environmentalForm.moldAreas.areasInspection;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.contactIdCode
          ] = task.contactId;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.startDateCode
          ] = task.environmentalForm.startDate;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.dealIdCode
          ] = task.id;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.inspectionType
          ] = task.environmentalForm.moldAreas.moldInspectionType;
          break;
        case DamageAreaType.Bacteria:
          damageInspectionList =
            task.environmentalForm.bacteriasAreas.areasInspection;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.contactIdCode
          ] = task.contactId;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.startDateCode
          ] = task.environmentalForm.startDate;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.dealIdCode
          ] = task.id;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.inspectionType
          ] = task.environmentalForm.bacteriasAreas.moldInspectionType;
          break;
        case DamageAreaType.Soot:
          damageInspectionList =
            task.environmentalForm.sootAreas.areasInspection;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.contactIdCode
          ] = task.contactId;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.startDateCode
          ] = task.environmentalForm.startDate;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.dealIdCode
          ] = task.id;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.inspectionType
          ] = task.environmentalForm.sootAreas.moldInspectionType;
          break;
        default:
          break;
      }

      await Promise.all(
        damageInspectionList.map(async (area) => {
          if (area.areaName) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaNameCode] =
              area.areaName;
          }
          if (area.areaRH) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaRHCode] =
              area.areaRH;
          }

          if (area.areaCondition.length > 0) {
            postData.FIELDS[area.damageInspectionBitrixMapping.conditionCode] =
              area.areaCondition;
          }

          if (area.areaPictures) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.areaPicturesCode
            ] = area.areaPictures;
          }
          if (area.areaNotes) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaNotesCode] =
              area.areaNotes;
          }
          if (area.removeCeiling) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeCeilingCode
            ] = area.removeCeiling;
          }
          if (area.ceilingNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.ceilingNotesCode
            ] = area.ceilingNotes;
          }
          if (area.removeDrywall) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeDrywallCode
            ] = area.removeDrywall;
          }
          if (area.drywallNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.drywallNotesCode
            ] = area.drywallNotes;
          }
          if (area.removeBaseboards) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeBaseboardsCode
            ] = area.removeBaseboards;
          }
          if (area.baseboardsNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.baseboardsNotesCode
            ] = area.baseboardsNotes;
          }
          if (area.removeFlooring) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeFlooringCode
            ] = area.removeFlooring;
          }
          if (area.flooringNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.flooringNotesCode
            ] = area.flooringNotes;
          }
          if (area.decontamination) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.decontaminationCode
            ] = area.decontamination;
          }
          if (area.furnitureOption) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.furnitureOptionCode
            ] = area.furnitureOption;
          }
          if (area.beddingsOption) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.beddingsOptionCode
            ] = area.beddingsOption;
          }
          if (area.observations) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.observationsCode
            ] = area.observations;
          }
          if (area.samples) {
            area.samples.forEach((element) => {
              postData.FIELDS[element.sampleBitrixMapping.sampleTypeCode] =
                element.type;
              postData.FIELDS[element.sampleBitrixMapping.labResultCode] =
                element.labResult;
              if (type == DamageAreaType.Mold) {
                postData.FIELDS[element.sampleBitrixMapping.volumeCode] =
                  element.volume;
                postData.FIELDS[
                  element.sampleBitrixMapping.cassetteNumberCode
                ] = element.cassetteNumber;
                postData.FIELDS[element.sampleBitrixMapping.toxicMoldCode] =
                  element.toxicMold;
              }
            });
          }
          if (area.recomendations) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.recomendationsCode
            ] = area.recomendations;
          }
        })
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();

      return response && response.result > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
