import { Injectable } from "@angular/core";
import { symlinkSync } from "fs";
import { element } from "protractor";
import { Observable } from "rxjs";
import { BitrixPicture, BitrixPictureList } from "../models/bitrix-picture";
import { DamageInspection } from "../models/damage-inspection";
import { DamageAreaType, InspectionStatus } from "../models/enums";
import { BitrixFolder, InspectionTask } from "../models/inspection-task";
import { SyncInfo } from "../models/sync-info";
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

  async syncSubfolder(task: InspectionTask): Promise<number> {
    try {
      var postData = {
        id: 100,
        data: {
          NAME: `${task.id}-${task.title}`,
        },
      };
      var response = await this.bitrix.createSubfolder(postData).toPromise();
      if (response?.result?.ID > 0) {
        return response.result.ID;
      } else return -1;
    } catch (error) {
      console.log(error);
    }
    return -1;
  }

  async syncListImages(
    pictures: BitrixPictureList,
    folder: BitrixFolder,
    name: string
  ): Promise<BitrixPictureList> {
    if (folder.syncInfo.isSync && !pictures.syncInfo.isSync) {
      await Promise.all(
        pictures.images.map(async (item, index) => {
          if (!item.isSync) {
            var postData = {
              id: folder.syncInfo.syncCode,
              data: {
                NAME: `${name}-${index + 1}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
              },
              fileContent: item.base64Image.replace(
                "data:image/png;base64,",
                ""
              ),
            };

            var response = await this.bitrix.addFile(postData);
            if (response?.result?.FILE_ID > 0) {
              pictures.images[index].isSync = true;
              pictures.images[
                index
              ].syncCode = response.result.FILE_ID.toString();
              pictures.imagesCodesSync.push(response.result.FILE_ID);
            } else {
              pictures.images[index].isSync = false;
            }
            return response;
          }
        })
      );
    }

    if (
      pictures.images.length > 0 &&
      pictures.images.find((x) => !x.isSync) != null
    ) {
      pictures.syncInfo.isSync = false;
    } else {
      pictures.syncInfo.isSync = true;
    }
    return pictures;
  }
  async syncTaskImages(task: InspectionTask) {
    await Promise.all(
      task.environmentalForm.moldAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.moldAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.moldAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "MoldIns-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return true;
        })
    );

    await Promise.all(
      task.environmentalForm.bacteriasAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.bacteriasAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.bacteriasAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "BactIns-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return true;
        })
    );

    await Promise.all(
      task.environmentalForm.bacteriasAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.bacteriasAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.bacteriasAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "Soot-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return true;
        })
    );

    await this.syncListImages(
      task.environmentalForm.generalInfoInspection.pictureHouseNumbers,
      task.bitrixFolder,
      "General-HouseNumber"
    );

    await this.syncListImages(
      task.environmentalForm.generalInfoInspection.picturesFrontHouse,
      task.bitrixFolder,
      "General-FrontHouse"
    );
  }

  async syncGeneralInformation(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        id: task.id,
        fields: {
          UF_CRM_1606466447:
            task.environmentalForm.generalInfoInspection.propertyYear,
          UF_CRM_1606466564:
            task.environmentalForm.generalInfoInspection.propertyType,
          UF_CRM_1606466601:
            task.environmentalForm.generalInfoInspection.interiorTemperature,
          UF_CRM_1606466624:
            task.environmentalForm.generalInfoInspection
              .exteriorRelativeHumidity,
          UF_CRM_1606466669:
            task.environmentalForm.generalInfoInspection.HVACSystemCondition,
          UF_CRM_1606466692:
            task.environmentalForm.generalInfoInspection.ductsCondition,
          UF_CRM_1606466732:
            task.environmentalForm.generalInfoInspection.atticCondition,
        },
      };

      if (
        task.environmentalForm.generalInfoInspection.picturesFrontHouse.images
          .length > 0
      ) {
        var x = task.environmentalForm.generalInfoInspection.picturesFrontHouse.images.map(
          (x, index) => {
            return {
              fileData: [
                `FrontHouse-${index}-${task.id}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
                x.base64Image.replace("data:image/png;base64,", ""),
              ],
            };
          }
        );
        postData.fields["UF_CRM_1606466511"] = x;
      }

      if (
        task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images
          .length > 0
      ) {
        postData.fields["UF_CRM_1606466494"] = {
          fileData: [
            `HouseNumber-${task.id}-${Math.floor(Math.random() * 1000)}.png`,
            task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images[0].base64Image.replace(
              "data:image/png;base64,",
              ""
            ),
          ],
        };
      }

      var response = await this.bitrix.updateDeal(postData).toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
  async syncTask(task: InspectionTask) {
    if (!task.bitrixFolder.syncInfo.isSync) {
      var result = await this.syncSubfolder(task);
      task.bitrixFolder.syncInfo.isSync = result > 0;
      task.bitrixFolder.syncInfo.syncCode = result.toString();
      await this.inspectionStorage.update(task);
    }

    await this.syncTaskImages(task);
    if (!task.environmentalForm.generalInfoInspection.syncInfo.isSync) {
      var result = await this.syncGeneralInformation(task);
      if (result > 0) {
        task.environmentalForm.generalInfoInspection.syncInfo.isSync = true;
        task.environmentalForm.generalInfoInspection.syncInfo.syncCode = result.toString();
      }
    }

    if (!task.environmentalForm.moldAreas.syncInfo.isSync) {
      if (
        task.environmentalForm.moldAreas.moldInspectionType &&
        task.environmentalForm.moldAreas.areasInspection.find((x) => x.areaName)
      ) {
        var result = await this.sendDamageInspection(
          task,
          DamageAreaType.Mold,
          48,
          "Mold Inspection - " + task.title
        );
        task.environmentalForm.moldAreas.syncInfo.isSync = result > 0;
        task.environmentalForm.moldAreas.syncInfo.syncCode = result.toString();
      } else {
        task.environmentalForm.moldAreas.syncInfo.isSync = true;
      }
      await this.inspectionStorage.update(task);
    }
    if (!task.environmentalForm.bacteriasAreas.syncInfo.isSync) {
      if (
        task.environmentalForm.bacteriasAreas.moldInspectionType &&
        task.environmentalForm.bacteriasAreas.areasInspection.find(
          (x) => x.areaName
        )
      ) {
        var result = await this.sendDamageInspection(
          task,
          DamageAreaType.Bacteria,
          50,
          "Bacteria Inspection - " + task.title
        );

        task.environmentalForm.bacteriasAreas.syncInfo.isSync = result > 0;
        task.environmentalForm.bacteriasAreas.syncInfo.syncCode = result.toString();
      } else {
        task.environmentalForm.bacteriasAreas.syncInfo.isSync = true;
      }
      await this.inspectionStorage.update(task);
    }
    if (!task.environmentalForm.sootAreas.syncInfo.isSync) {
      if (
        task.environmentalForm.sootAreas.moldInspectionType &&
        task.environmentalForm.sootAreas.areasInspection.find((x) => x.areaName)
      ) {
        var result = await this.sendDamageInspection(
          task,
          DamageAreaType.Soot,
          52,
          "Soot Inspection - " + task.title
        );
        task.environmentalForm.sootAreas.syncInfo.isSync = result > 0;
        task.environmentalForm.sootAreas.syncInfo.syncCode = result.toString();
      } else {
        task.environmentalForm.sootAreas.syncInfo.isSync = true;
      }
      await this.inspectionStorage.update(task);
    }

    if (
      task.environmentalForm.moldAreas.syncInfo.isSync &&
      task.environmentalForm.bacteriasAreas.syncInfo.isSync &&
      task.environmentalForm.sootAreas.syncInfo.isSync &&
      task.environmentalForm.generalInfoInspection.syncInfo.isSync
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
  ): Promise<number> {
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
          if (
            task.environmentalForm.moldAreas.areasInspection.find(
              (x: DamageInspection) =>
                x.areaPictures.images.length > 0 &&
                !x.areaPictures.syncInfo.isSync
            )
          ) {
            return -1;
          }
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
          if (
            task.environmentalForm.bacteriasAreas.areasInspection.find(
              (x: DamageInspection) =>
                x.areaPictures.images.length > 0 &&
                !x.areaPictures.syncInfo.isSync
            )
          ) {
            return -1;
          }
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
          if (
            task.environmentalForm.sootAreas.areasInspection.find(
              (x: DamageInspection) =>
                x.areaPictures.images.length > 0 &&
                !x.areaPictures.syncInfo.isSync
            )
          ) {
            return -1;
          }
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
        damageInspectionList.map(async (area: DamageInspection) => {
          if (area.areaPictures.imagesCodesSync.length > 0) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.areaPicturesCode
            ] = area.areaPictures.imagesCodesSync;
          }

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

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
}
