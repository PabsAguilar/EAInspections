import { Injectable } from "@angular/core";
import { async } from "@angular/core/testing";
import { ToastController } from "@ionic/angular";
import { ObjectUnsubscribedError, Observable, of, Subject } from "rxjs";
import { observeOn } from "rxjs/operators";
import { BitrixPicture, BitrixPictureList } from "../models/bitrix-picture";
import { Company } from "../models/company";
import { Contact } from "../models/contact";
import { DamageInspection } from "../models/damage-inspection";
import {
  bitrixMappingComprehensive,
  DamageAreaType,
  ENDealMapping,
  EnumEnterprise,
  InspectionStatus,
  InspectionType,
  ITestDealMapping,
  ReportStatusDeal,
} from "../models/enums";
import { Asbesto } from "../models/environmental-form/asbesto";
import { DamageAreas } from "../models/environmental-form/damage-areas";
import { Lead } from "../models/environmental-form/lead";
import { MoistureMapping } from "../models/environmental-form/moisture-mapping";
import { BitrixFolder, InspectionTask } from "../models/inspection-task";
import { Scheduling } from "../models/scheduling";
import { SyncInfo } from "../models/sync-info";
import { User } from "../models/user";
import { AuthenticationService } from "./authentication.service";
import { BitrixItestService } from "./bitrix-itest.service";
import { InspectionsStorageService } from "./inspections-storage.service";
import { ItestDealService } from "./itest-deal.service";
import { SchedulingStorageService } from "./scheduling-storage.service";
const ItestImageMainFolder = 100;
const ENImageMainFolder = 75763;
@Injectable({
  providedIn: "root",
})
export class SyncInspectionService {
  constructor(
    private bitrix: BitrixItestService,
    private inspectionStorage: InspectionsStorageService,
    private schedulingStorageService: SchedulingStorageService,
    private toast: ToastController,
    private itestDealService: ItestDealService,
    private autenticateService: AuthenticationService
  ) {}

  private syncEvent = new Subject<any>();

  publishSomeData(data: any) {
    this.syncEvent.next(data);
  }

  getObservable(): Subject<any> {
    return this.syncEvent;
  }

  async syncSubfolder(task: InspectionTask): Promise<number> {
    try {
      var idFolder = ItestImageMainFolder;
      if (task.inspectionType == InspectionType.Comprehensive) {
        idFolder = ENImageMainFolder;
      }
      var postData = {
        id: idFolder,
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
    if (
      folder.syncInfo.isSync &&
      pictures.images.find((x) => !x.isSync) != null
    ) {
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
              pictures.imagesCodesSync.push({
                file: response.result.FILE_ID,
                listSync: false,
              });
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

  async syncENTaskImages(task: InspectionTask): Promise<InspectionTask> {
    await Promise.all(
      task.comprehesiveForm.areas
        .filter(
          (x) =>
            x.pictures.images.length > 0 &&
            x.pictures.images.find((y) => !y.isSync) != null
        )
        .map(async (item, index) => {
          task.comprehesiveForm.areas[
            index
          ].pictures = await this.syncListImages(
            task.comprehesiveForm.areas[index].pictures,
            task.bitrixFolder,
            "AreaInsp-" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    await Promise.all(
      task.comprehesiveForm.bathrooms
        .filter(
          (x) => x.pictures.images.length > 0 && !x.pictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.comprehesiveForm.bathrooms[
            index
          ].pictures = await this.syncListImages(
            task.comprehesiveForm.bathrooms[index].pictures,
            task.bitrixFolder,
            "Bathroom-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers = await this.syncListImages(
      task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers,
      task.bitrixFolder,
      "General-HouseNumber"
    );
    await this.inspectionStorage.update(task);
    task.comprehesiveForm.generalInfoInspection.picturesFrontHouse = await this.syncListImages(
      task.comprehesiveForm.generalInfoInspection.picturesFrontHouse,
      task.bitrixFolder,
      "General-FrontHouse"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.kitchen.pictures = await this.syncListImages(
      task.comprehesiveForm.kitchen.pictures,
      task.bitrixFolder,
      "Kitchen"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.HVAC_AC.pictures = await this.syncListImages(
      task.comprehesiveForm.HVAC_AC.pictures,
      task.bitrixFolder,
      "HVAC_AC"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.utilityRoom.pictures = await this.syncListImages(
      task.comprehesiveForm.utilityRoom.pictures,
      task.bitrixFolder,
      "UtilityRoom"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.atic.pictures = await this.syncListImages(
      task.comprehesiveForm.atic.pictures,
      task.bitrixFolder,
      "Attic"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.enviromentalSection.MoldLocationPicture = await this.syncListImages(
      task.comprehesiveForm.enviromentalSection.MoldLocationPicture,
      task.bitrixFolder,
      "MoldLocation"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.exterior.pictures = await this.syncListImages(
      task.comprehesiveForm.exterior.pictures,
      task.bitrixFolder,
      "Exterior"
    );
    await this.inspectionStorage.update(task);

    task.comprehesiveForm.insurance.picturesPolicy = await this.syncListImages(
      task.comprehesiveForm.insurance.picturesPolicy,
      task.bitrixFolder,
      "Policy"
    );
    await this.inspectionStorage.update(task);

    return task;
  }

  async syncTaskImages(task: InspectionTask): Promise<InspectionTask> {
    await Promise.all(
      task.environmentalForm.moldAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 &&
            x.areaPictures.images.find((y) => !y.isSync) != null
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

          return Promise.resolve(true);
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

          return Promise.resolve(true);
        })
    );

    await Promise.all(
      task.environmentalForm.sootAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.sootAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.sootAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "Soot-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    task.environmentalForm.generalInfoInspection.pictureHouseNumbers = await this.syncListImages(
      task.environmentalForm.generalInfoInspection.pictureHouseNumbers,
      task.bitrixFolder,
      "General-HouseNumber"
    );
    await this.inspectionStorage.update(task);
    task.environmentalForm.generalInfoInspection.picturesFrontHouse = await this.syncListImages(
      task.environmentalForm.generalInfoInspection.picturesFrontHouse,
      task.bitrixFolder,
      "General-FrontHouse"
    );
    await this.inspectionStorage.update(task);

    task.iTestAgreements.signature = await this.syncListImages(
      task.iTestAgreements.signature,
      task.bitrixFolder,
      "ItestAgreementSignature"
    );

    await this.inspectionStorage.update(task);
    task.expertNetworkAgreements.signature = await this.syncListImages(
      task.expertNetworkAgreements.signature,
      task.bitrixFolder,
      "ENAgreementSignature"
    );
    await this.inspectionStorage.update(task);

    return task;
  }

  async syncGeneralInformation(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        id: task.id,
        fields: { STAGE_ID: "EXECUTING" },
      };
      switch (task.internalStatus) {
        case InspectionStatus.PendingSaved:
          postData.fields["UF_CRM_1613380179"] = ReportStatusDeal.Saved;
          break;

        case InspectionStatus.PendingSentLab:
          postData.fields["UF_CRM_1613380179"] = ReportStatusDeal.Labs;
          break;

        case InspectionStatus.PendingToComplete:
          postData.fields["UF_CRM_1613380179"] = ReportStatusDeal.Submitted;
          break;

        default:
          postData.fields["UF_CRM_1613380179"] = ReportStatusDeal.Saved;
          break;
      }

      if (task.environmentalForm.generalInfoInspection.propertyYear)
        postData.fields["UF_CRM_1606466447"] =
          task.environmentalForm.generalInfoInspection.propertyYear;
      if (task.environmentalForm.generalInfoInspection.propertyType)
        postData.fields["UF_CRM_1606466564"] =
          task.environmentalForm.generalInfoInspection.propertyType;
      if (task.environmentalForm.generalInfoInspection.interiorTemperature)
        postData.fields["UF_CRM_1606466601"] =
          task.environmentalForm.generalInfoInspection.interiorTemperature;
      if (task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity)
        postData.fields["UF_CRM_1606466624"] =
          task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity;
      if (task.environmentalForm.generalInfoInspection.HVACSystemCondition)
        postData.fields["UF_CRM_1606466669"] =
          task.environmentalForm.generalInfoInspection.HVACSystemCondition;
      if (task.environmentalForm.generalInfoInspection.ductsCondition)
        postData.fields["UF_CRM_1606466692"] =
          task.environmentalForm.generalInfoInspection.ductsCondition;
      if (task.environmentalForm.generalInfoInspection.atticCondition)
        postData.fields["UF_CRM_1606466732"] =
          task.environmentalForm.generalInfoInspection.atticCondition;

      if (task.environmentalForm.generalInfoInspection.typeOfLossDesc) {
        postData.fields[ITestDealMapping.typesOfLoss] =
          task.environmentalForm.generalInfoInspection.typeOfLossDesc;
      }
      if (task.environmentalForm.generalInfoInspection.affectedArea) {
        postData.fields[ITestDealMapping.affectedArea] =
          task.environmentalForm.generalInfoInspection.affectedArea;
      }
      if (task.environmentalForm.generalInfoInspection.waterDamageCategory) {
        postData.fields[ITestDealMapping.waterDamageCategory] =
          task.environmentalForm.generalInfoInspection.waterDamageCategory;
      }
      if (task.environmentalForm.generalInfoInspection.waterDamageClass) {
        postData.fields[ITestDealMapping.waterDamageClass] =
          task.environmentalForm.generalInfoInspection.waterDamageClass;
      }

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
      if (task.iTestAgreements.signature.images.length > 0) {
        postData.fields["UF_CRM_1612683169"] =
          task.environmentalForm.generalInfoInspection.agreementSignedYesNo;

        var itestSignature = task.iTestAgreements.signature.images.map(
          (x, index) => {
            return {
              fileData: [
                `ITestSig-${x.name}-${task.id}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
                x.base64Image.replace("data:image/png;base64,", ""),
              ],
            };
          }
        );

        var expertNSignature = task.expertNetworkAgreements.signature.images.map(
          (x, index) => {
            return {
              fileData: [
                `ENSignature-${x.name}-${task.id}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
                x.base64Image.replace("data:image/png;base64,", ""),
              ],
            };
          }
        );

        var signatures = itestSignature.concat(expertNSignature);
        postData.fields["UF_CRM_1612780368"] = signatures;
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

  async syncContact(contact: Contact, enterprise: string): Promise<Contact> {
    try {
      var postData = {
        fields: {
          NAME: contact.firstName,
          SECOND_NAME: "",
          LAST_NAME: contact.lastName,
          PHONE: [{ VALUE: contact.phone }],
          EMAIL: [{ VALUE: contact.email }],
        },
      };
      var response = await this.bitrix
        .createContact(postData, enterprise)
        .toPromise();
      if (response?.result > 0) {
        contact.syncInfo.isSync = true;
        contact.syncInfo.syncCode = response.result;
        contact.idContact = response.result;
        return contact;
      } else {
        contact.syncInfo.isSync = false;
        return contact;
      }
    } catch (error) {
      console.log(error);
    }
    contact.syncInfo.isSync = false;
    return contact;
  }

  async syncCompany(company: Company, enterprise: string): Promise<Company> {
    try {
      var postData = {
        fields: {
          TITLE: company.title,
          COMPANY_TYPE: "CUSTOMER",
          COMMENTS: "Created by Inspection MobileApp",
          CURRENCY_ID: "USD",
          IS_MY_COMPANY: "N",
          PHONE: [{ VALUE: company.phone }],
          EMAIL: [{ VALUE: company.email }],
        },
      };
      var response = await this.bitrix
        .createCompany(postData, enterprise)
        .toPromise();
      if (response?.result > 0) {
        company.syncInfo.isSync = true;
        company.syncInfo.syncCode = response.result;
        company.id = response.result;
        return company;
      } else {
        company.syncInfo.isSync = false;
        return company;
      }
    } catch (error) {
      console.log(error);
    }
    company.syncInfo.isSync = false;
    return company;
  }

  async syncAllPending(): Promise<Observable<boolean>> {
    var user = await this.autenticateService.getUser();
    var schedulingList = await this.schedulingStorageService.getPendingToSync();
    await Promise.all(
      (await schedulingList).map(async (x) => {
        (await this.syncSchedulingInspection(x, user)).subscribe(async (y) => {
          if (y) {
          } else {
            var message = this.toast.create({
              message: "Sync failed, please try again later.",
              color: "warning",
              duration: 2000,
            });
            (await message).present();
          }
        });
      })
    );

    var inspectionList = await this.inspectionStorage.getPendingToSync();
    await Promise.all(
      (await inspectionList).map(async (x) => {
        (await this.syncTask(x)).subscribe(async (y) => {
          if (y) {
          } else {
            var message = this.toast.create({
              message:
                "Sync failed for " + x.title + ", please try again later.",
              color: "warning",
              duration: 2000,
            });
            (await message).present();
          }
        });
      })
    );
    if (schedulingList.length == 0 && inspectionList.length == 0) {
      var message = this.toast.create({
        message: "There is no pending items to sync.",
        color: "primary",
        duration: 2000,
      });
      (await message).present();
    }
    return of(true);
  }

  pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }

  async getBitrixDateTime(date) {
    date = new Date(date);
    var offset: any = date.getTimezoneOffset();
    offset =
      (offset < 0 ? "+" : "-") + // Note the reversed sign!
      this.pad(parseInt(Math.abs(offset / 60).toString()), 2) +
      ":" +
      this.pad(Math.abs(offset % 60), 2);

    var paddatepart = function (part) {
      return part >= 10 ? part.toString() : "0" + part.toString();
    };

    var dateStr =
      date.getFullYear() +
      "-" +
      paddatepart(1 + date.getMonth()) +
      "-" +
      paddatepart(date.getDate()) +
      "T" +
      paddatepart(date.getHours()) +
      ":" +
      paddatepart(date.getMinutes()) +
      ":" +
      paddatepart(date.getSeconds()) +
      "-06:00";
    return dateStr;
  }
  async syncSchedulingInspection(
    scheduling: Scheduling,
    user: User
  ): Promise<Observable<boolean>> {
    try {
      if (!scheduling.contact.syncInfo.isSync) {
        scheduling.contact = await this.syncContact(
          scheduling.contact,
          scheduling.serviceType
        );

        if (!scheduling.contact.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }
      scheduling.scheduleDateString = await this.getBitrixDateTime(
        scheduling.scheduleDateTime
      );
      if (
        scheduling.insuranceCompanyContact &&
        !scheduling.insuranceCompanyContact.syncInfo.isSync
      ) {
        scheduling.insuranceCompanyContact = await this.syncContact(
          scheduling.insuranceCompanyContact,
          scheduling.serviceType
        );

        if (!scheduling.insuranceCompanyContact.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }

      if (
        scheduling.referalPartner &&
        !scheduling.referalPartner.syncInfo.isSync
      ) {
        scheduling.referalPartner = await this.syncContact(
          scheduling.referalPartner,
          scheduling.serviceType
        );
        if (!scheduling.referalPartner.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }
      if (
        scheduling.referalPartnerCompany &&
        !scheduling.referalPartnerCompany.syncInfo.isSync
      ) {
        scheduling.referalPartnerCompany = await this.syncCompany(
          scheduling.referalPartnerCompany,
          scheduling.serviceType
        );
        if (!scheduling.referalPartnerCompany.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }

      if (
        scheduling.insuranceCompany &&
        !scheduling.insuranceCompany.syncInfo.isSync
      ) {
        scheduling.insuranceCompany = await this.syncCompany(
          scheduling.insuranceCompany,
          scheduling.serviceType
        );
        if (!scheduling.insuranceCompany.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }

      var insuranceCompany: string[] = [];
      if (scheduling.insuranceCompanyContact) {
        insuranceCompany.push(
          "C_" + scheduling.insuranceCompanyContact.idContact
        );
      }
      if (scheduling.insuranceCompany) {
        insuranceCompany.push("CO_" + scheduling.insuranceCompany.id);
      }

      var referalContact: string[] = [];
      if (scheduling.referalPartner) {
        referalContact.push("C_" + scheduling.referalPartner.idContact);
      }
      if (scheduling.referalPartnerCompany) {
        referalContact.push("CO_" + scheduling.referalPartnerCompany.id);
      }

      let postData = {
        fields: {
          TITLE:
            "Form " +
            scheduling.contact.firstName +
            " " +
            scheduling.contact.lastName +
            " - EnApp",
          TYPE_ID: "",
          STAGE_ID:
            scheduling.serviceType == EnumEnterprise.itest
              ? "PREPAYMENT_INVOICE"
              : "NEW",
          COMPANY_ID: "",
          CONTACT_ID: scheduling.contact.idContact,
          OPENED: "N",
          CLOSED: "N",
          ASSIGNED_BY_ID: scheduling.inspectorUserId,
          CREATED_BY_ID: scheduling.inspectorUserId,
          COMMENTS: "Created with Scheduling form within EN Mobile APP.",

          PROBABILITY: null,
          CURRENCY_ID: "USD",
          OPPORTUNITY: 0,
          BEGINDATE: "",
          CLOSEDATE: "",
        },
      };

      if (scheduling.serviceType == EnumEnterprise.itest) {
        postData.fields[ITestDealMapping.instructions] = scheduling.notes; //UF_CRM_1612683023
        postData.fields[ITestDealMapping.dealDateTime] =
          scheduling.scheduleDateString; //this.date2str(scheduling.scheduleDateTime),  //UF_CRM_1612683055
        postData.fields[ITestDealMapping.serviceAddress] =
          scheduling.serviceAddress; //UF_CRM_1606466289
        postData.fields[ITestDealMapping.inspector] =
          scheduling.inspectorUserId; //UF_CRM_1612682994
        postData.fields[ITestDealMapping.user] = user.userId; //UF_CRM_1612686317
        postData.fields[ITestDealMapping.insuranceCompany] = insuranceCompany; //UF_CRM_1612691342
        postData.fields[ITestDealMapping.inspectionTypes] =
          scheduling.inspectionTypes; //UF_CRM_1612433280
        // postData[ITestDealMapping.typesOfLoss] = scheduling.typeOfLossDesc; //UF_CRM_1618512396
        // postData[ITestDealMapping.affectedArea] = scheduling.affectedArea; //UF_CRM_1618512421
        // postData[ITestDealMapping.waterDamageCategory] =
        //   scheduling.waterDamageCategory; //UF_CRM_1618512488
        // postData[ITestDealMapping.waterDamageClass] = scheduling.waterDamageClass; //UF_CRM_1618512548
        postData[ITestDealMapping.referenceContact] = referalContact; //UF_CRM_1612691326
      } else {
        postData.fields[ENDealMapping.instructions] = scheduling.notes;
        postData.fields[ENDealMapping.dealDateTime] =
          scheduling.scheduleDateString;
        postData.fields[ENDealMapping.serviceAddress] =
          scheduling.serviceAddress;
        postData.fields[ENDealMapping.inspector] = scheduling.inspectorUserId;
        postData.fields[ENDealMapping.user] = user.userId; //scheduler
        postData.fields[ENDealMapping.insuranceCompany] = insuranceCompany;
        postData.fields[ENDealMapping.referenceContact] =
          scheduling.serviceType == EnumEnterprise.itest
            ? referalContact
            : scheduling.referalPartner?.idContact;
      }

      var response = await this.bitrix
        .createDeal(postData, scheduling.serviceType)
        .toPromise();

      if (response && response.result > 0) {
        scheduling.syncInfo.isSync = true;
        scheduling.syncInfo.syncCode = response.result;
        scheduling.internalStatus = InspectionStatus.Completed;
        await this.schedulingStorageService.update(scheduling);
        await this.itestDealService.getExternal(user);
        await this.itestDealService.refreshFieldsFromServer(user);
        return of(true);
      } else return of(false);
    } catch (error) {
      console.log(error);
      return of(false);
    }
  }
  preprareImages(
    imagesList: BitrixPictureList,
    taskId: number,
    fieldName: string
  ) {
    var image = imagesList.images.map((s, imageIndex) => {
      return {
        fileData: [
          `${fieldName}-${imageIndex}-${taskId}-${Math.floor(
            Math.random() * 1000
          )}.png`,
          s.base64Image.replace("data:image/png;base64,", ""),
        ],
      };
    });
    return image;
  }
  async syncENTask(task: InspectionTask): Promise<Observable<boolean>> {
    try {
      if (!task.bitrixFolder.syncInfo.isSync) {
        var result = await this.syncSubfolder(task);
        task.bitrixFolder.syncInfo.isSync = result > 0;
        task.bitrixFolder.syncInfo.syncCode = result.toString();
        await this.inspectionStorage.update(task);
      }

      task = await this.syncENTaskImages(task);

      let postData = {
        id: task.id,
        fields: { STAGE_ID: "1" },
      };

      if (task.comprehesiveForm.generalInfoInspection.propertyYear)
        postData.fields[
          task.comprehesiveForm.generalInfoInspection.generalInfoInspectionBitrixMapping.propertyYearCode
        ] = task.comprehesiveForm.generalInfoInspection.propertyYear;
      if (task.comprehesiveForm.generalInfoInspection.propertyType)
        postData.fields[
          task.comprehesiveForm.generalInfoInspection.generalInfoInspectionBitrixMapping.propertyTypeCode
        ] = task.comprehesiveForm.generalInfoInspection.propertyType;

      if (
        task.comprehesiveForm.generalInfoInspection.picturesFrontHouse.images
          .length > 0
      ) {
        var x = await this.preprareImages(
          task.comprehesiveForm.generalInfoInspection.picturesFrontHouse,
          task.id,
          "FrontHouse"
        );
        postData.fields["UF_CRM_1591107445"] = x;
      }

      if (
        task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers.images
          .length > 0
      ) {
        var x = await this.preprareImages(
          task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers,
          task.id,
          "HouseNumber"
        );
        postData.fields["UF_CRM_1591107425"] = x;
      }

      task.comprehesiveForm.areas.map((x, index) => {
        Object.entries(x.areaBitrixMapping).map((y) => {
          var item = x[y[0].replace("Code", "")];
          if (item) {
            if (item.images) {
              var image = item.images.map((s, imageIndex) => {
                return {
                  fileData: [
                    `Area${index + 1}-${imageIndex}-${task.id}-${Math.floor(
                      Math.random() * 1000
                    )}.png`,
                    s.base64Image.replace("data:image/png;base64,", ""),
                  ],
                };
              });
              if (image.length > 0) {
                postData.fields[y[1]] = image;
              }
            } else {
              postData.fields[y[1]] = item;
            }
          }
        });
      });

      task.comprehesiveForm.bathrooms.map((x, index) => {
        Object.entries(x.generalConditionBitrixMapping).map((y) => {
          var item = x[y[0].replace("Code", "")];
          if (item) {
            if (item.images) {
              var image = item.images.map((s, imageIndex) => {
                return {
                  fileData: [
                    `Bathroom${index + 1}-${imageIndex}-${task.id}-${Math.floor(
                      Math.random() * 1000
                    )}.png`,
                    s.base64Image.replace("data:image/png;base64,", ""),
                  ],
                };
              });
              if (image.length > 0) {
                postData.fields[y[1]] = image;
              }
            } else {
              postData.fields[y[1]] = item;
            }
          }
        });
      });

      Object.entries(
        task.comprehesiveForm.atic.generalConditionBitrixMapping
      ).map((y) => {
        var item = task.comprehesiveForm.atic[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Attic-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.utilityRoom.generalConditionBitrixMapping
      ).map((y) => {
        var item = task.comprehesiveForm.utilityRoom[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `UtilityRoom-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.HVAC_AC.generalConditionBitrixMapping
      ).map((y) => {
        var item = task.comprehesiveForm.HVAC_AC[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `UtilityRoom-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.enviromentalSection
          .environmentalSectionBitrixMapping
      ).map((y) => {
        var item =
          task.comprehesiveForm.enviromentalSection[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `EnvironmentalSection-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.exterior.generalConditionBitrixMapping
      ).map((y) => {
        var item = task.comprehesiveForm.exterior[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Exterior-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.insurance.insuranceBitrixMapping
      ).map((y) => {
        var item = task.comprehesiveForm.insurance[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Insurance-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.recomendations.recomendationsBitrixMapping
      ).map((y) => {
        var item =
          task.comprehesiveForm.recomendations[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Recomendations-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[
              task.comprehesiveForm.recomendations.recomendationsBitrixMapping[
                y[0]
              ]
            ] = item;
          }
        }
      });

      Object.entries(
        task.comprehesiveForm.reminders.remindersBitrixMapping
      ).map((y) => {
        var item = task.comprehesiveForm.reminders[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Reminders-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[
              task.comprehesiveForm.reminders.remindersBitrixMapping[y[0]]
            ] = item;
          }
        }
      });

      var response = await this.bitrix.updateDeal(postData).toPromise();
      if (response && response.result > 0) {
        task.internalStatus = InspectionStatus.Completed;
      }
      await this.inspectionStorage.update(task);
      return of(true);
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
      console.log(error);
      return of(false);
    }
  }

  async syncTask(task: InspectionTask): Promise<Observable<boolean>> {
    try {
      if (task.startedSync) {
        var today = new Date();
        var lastSync = new Date(task.syncStartDate);

        var difference = today.getTime() - lastSync.getTime();
        var minutes = Math.round(difference / 60000);
        if (minutes <= 2) {
          return of(true);
        }
      }

      task.startedSync = true;
      task.syncStartDate = new Date();
      if (task.inspectionType == InspectionType.Comprehensive) {
        return this.syncENTask(task);
      }
      if (!task.bitrixFolder.syncInfo.isSync) {
        var result = await this.syncSubfolder(task);
        task.bitrixFolder.syncInfo.isSync = result > 0;
        task.bitrixFolder.syncInfo.syncCode = result.toString();
        await this.inspectionStorage.update(task);
      }

      task = await this.syncTaskImages(task);
      if (true) {
        //!task.environmentalForm.generalInfoInspection.syncInfo.isSync) {
        var result = await this.syncGeneralInformation(task);
        if (result > 0) {
          task.environmentalForm.generalInfoInspection.syncInfo.isSync = true;
          task.environmentalForm.generalInfoInspection.syncInfo.syncCode = result.toString();
        }
      }

      if (
        !task.environmentalForm.moldAreas.syncInfo.isSync ||
        task.environmentalForm.moldAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.moldAreas.moldInspectionType &&
          task.environmentalForm.moldAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          task.environmentalForm.moldAreas = await this.sendDamageInspection(
            task.environmentalForm.moldAreas,
            task,
            DamageAreaType.Mold,
            48,
            "Mold Inspection - " + task.title
          );
        } else {
          task.environmentalForm.moldAreas.syncInfo.isSync = true;
          task.environmentalForm.moldAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }
      if (
        !task.environmentalForm.bacteriasAreas.syncInfo.isSync ||
        task.environmentalForm.bacteriasAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.bacteriasAreas.moldInspectionType &&
          task.environmentalForm.bacteriasAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          task.environmentalForm.bacteriasAreas = await this.sendDamageInspection(
            task.environmentalForm.bacteriasAreas,
            task,
            DamageAreaType.Bacteria,
            50,
            "Bacteria Inspection - " + task.title
          );
        } else {
          task.environmentalForm.bacteriasAreas.syncInfo.isSync = true;
          task.environmentalForm.bacteriasAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }
      if (
        !task.environmentalForm.sootAreas.syncInfo.isSync ||
        task.environmentalForm.sootAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.sootAreas.moldInspectionType &&
          task.environmentalForm.sootAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          task.environmentalForm.sootAreas = await this.sendDamageInspection(
            task.environmentalForm.sootAreas,
            task,
            DamageAreaType.Soot,
            52,
            "Soot Inspection - " + task.title
          );
        } else {
          task.environmentalForm.sootAreas.syncInfo.isSync = true;
          task.environmentalForm.sootAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        !task.environmentalForm.moistureMappingAreas.syncInfo.isSync ||
        task.environmentalForm.moistureMappingAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.moistureMappingAreas.inspectionType &&
          task.environmentalForm.moistureMappingAreas.areamoistureMapping.find(
            (x) => x.area
          )
        ) {
          var result = await this.sendMoistureMapping(task);
          task.environmentalForm.moistureMappingAreas.syncInfo.isSync =
            result > 0;
          task.environmentalForm.moistureMappingAreas.syncInfo.updated = false;
          task.environmentalForm.moistureMappingAreas.syncInfo.syncCode = task
            .environmentalForm.moistureMappingAreas.syncInfo.syncCode
            ? task.environmentalForm.moistureMappingAreas.syncInfo.syncCode
            : result.toString();
        } else {
          task.environmentalForm.moistureMappingAreas.syncInfo.isSync = true;
          task.environmentalForm.moistureMappingAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        !task.environmentalForm.asbestosAreas.syncInfo.isSync ||
        task.environmentalForm.asbestosAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.asbestosAreas.inspectionType &&
          task.environmentalForm.asbestosAreas.asbestosAreas.find(
            (x) => x.materialLocation
          )
        ) {
          var result = await this.sendAsbestos(task);
          task.environmentalForm.asbestosAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.asbestosAreas.syncInfo.syncCode = task
            .environmentalForm.asbestosAreas.syncInfo.syncCode
            ? task.environmentalForm.asbestosAreas.syncInfo.syncCode
            : result.toString();
          task.environmentalForm.asbestosAreas.syncInfo.updated = false;
        } else {
          task.environmentalForm.asbestosAreas.syncInfo.isSync = true;
          task.environmentalForm.asbestosAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        !task.environmentalForm.leadAreas.syncInfo.isSync ||
        task.environmentalForm.leadAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.leadAreas.inspectionType &&
          task.environmentalForm.leadAreas.leadAreas.find((x) => x.sample)
        ) {
          var result = await this.sendLead(task);
          task.environmentalForm.leadAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.leadAreas.syncInfo.syncCode = task
            .environmentalForm.leadAreas.syncInfo.syncCode
            ? task.environmentalForm.leadAreas.syncInfo.syncCode
            : result.toString();
          task.environmentalForm.leadAreas.syncInfo.updated = false;
        } else {
          task.environmentalForm.leadAreas.syncInfo.isSync = true;
          task.environmentalForm.leadAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        task.environmentalForm.moldAreas.syncInfo.isSync &&
        task.environmentalForm.bacteriasAreas.syncInfo.isSync &&
        task.environmentalForm.sootAreas.syncInfo.isSync &&
        task.environmentalForm.generalInfoInspection.syncInfo.isSync &&
        task.environmentalForm.moistureMappingAreas.syncInfo.isSync &&
        task.environmentalForm.leadAreas.syncInfo.isSync &&
        task.environmentalForm.asbestosAreas.syncInfo.isSync
      ) {
        if (task.internalStatus == InspectionStatus.PendingSaved) {
          task.internalStatus = InspectionStatus.Saved;
        }
        if (task.internalStatus == InspectionStatus.PendingSentLab) {
          task.internalStatus = InspectionStatus.LabsSent;
        }
        if (task.internalStatus == InspectionStatus.PendingToComplete) {
          task.internalStatus = InspectionStatus.Completed;
        }

        await this.inspectionStorage.update(task);
        return of(true);
      } else {
        await this.inspectionStorage.update(task);
        return of(false);
      }
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
      console.log(error);
      return of(false);
    }
  }

  async sendLead(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: 30,
        IBLOCK_TYPE_ID: "lists",

        FIELDS: {
          NAME: `Lead - ${task.id} - ${task.title}`,
          PROPERTY_3526: task.id,
        },
      };

      if (
        task.environmentalForm.leadAreas.syncInfo.syncCode &&
        parseInt(task.environmentalForm.leadAreas.syncInfo.syncCode) > 0
      ) {
        postData["ELEMENT_ID"] =
          task.environmentalForm.leadAreas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          30 + "-" + task.id + "-" + (Math.random() * 100).toString();
      }
      if (task.environmentalForm.leadAreas.contact) {
        postData.FIELDS[
          task.environmentalForm.leadAreas.leadAreasBitrixMapping.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.leadAreas.inspectionDate) {
        postData.FIELDS[
          task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionDateCode
        ] = this.getBitrixDateTime(
          task.environmentalForm.leadAreas.inspectionDate
        );
      }
      if (task.environmentalForm.leadAreas.inspectionType) {
        postData.FIELDS[
          task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionTypeCode
        ] = task.environmentalForm.leadAreas.inspectionType;
      }

      await Promise.all(
        task.environmentalForm.leadAreas.leadAreas.map(async (area: Lead) => {
          if (area.sample) {
            postData.FIELDS[area.bitrixMappingLead.sampleCode] = area.sample;
          }
          if (area.sampleOther) {
            postData.FIELDS[area.bitrixMappingLead.sampleOtherCode] =
              area.sampleOther;
          }

          if (area.cardinalDirection) {
            postData.FIELDS[area.bitrixMappingLead.cardinalDirectionCode] =
              area.cardinalDirection;
          }
          if (area.dimensionCm2) {
            postData.FIELDS[area.bitrixMappingLead.dimensionCm2Code] =
              area.dimensionCm2;
          }
          if (area.material) {
            postData.FIELDS[area.bitrixMappingLead.materialCode] =
              area.material;
          }
          if (area.typeOfSample) {
            postData.FIELDS[area.bitrixMappingLead.typeOfSampleCode] =
              area.typeOfSample;
          }
          if (area.labResults) {
            postData.FIELDS[area.bitrixMappingLead.labResultsCode] =
              area.labResults;
          }
          if (area.observations) {
            postData.FIELDS[area.bitrixMappingLead.observationsCode] =
              area.observations;
          }
        })
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, 30)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async sendAsbestos(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: 32,
        IBLOCK_TYPE_ID: "lists",

        FIELDS: {
          NAME: `Asbestos - ${task.id} - ${task.title}`,
          PROPERTY_3522: task.id,
        },
      };

      if (
        task.environmentalForm.asbestosAreas.syncInfo.syncCode &&
        parseInt(task.environmentalForm.asbestosAreas.syncInfo.syncCode) > 0
      ) {
        postData["ELEMENT_ID"] =
          task.environmentalForm.asbestosAreas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          32 + "-" + task.id + "-" + (Math.random() * 100).toString();
      }

      if (task.environmentalForm.asbestosAreas.contact) {
        postData.FIELDS[
          task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.asbestosAreas.inspectionDate) {
        postData.FIELDS[
          task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionDateCode
        ] = this.getBitrixDateTime(
          task.environmentalForm.asbestosAreas.inspectionDate
        );
      }
      if (task.environmentalForm.asbestosAreas.inspectionType) {
        postData.FIELDS[
          task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionTypeCode
        ] = task.environmentalForm.asbestosAreas.inspectionType;
      }

      await Promise.all(
        task.environmentalForm.asbestosAreas.asbestosAreas.map(
          async (area: Asbesto) => {
            if (area.materialLocation) {
              postData.FIELDS[area.asbestoBitrixMaping.materialLocationCode] =
                area.materialLocation;
            }
            if (area.materialLocationOther) {
              postData.FIELDS[
                area.asbestoBitrixMaping.materialLocationOtherCode
              ] = area.materialLocationOther;
            }
            if (area.materialDescription) {
              postData.FIELDS[
                area.asbestoBitrixMaping.materialDescriptionCode
              ] = area.materialDescription;
            }
            if (area.totalQuantity) {
              postData.FIELDS[area.asbestoBitrixMaping.totalQuantityCode] =
                area.totalQuantity;
            }
            if (area.F_NF) {
              postData.FIELDS[area.asbestoBitrixMaping.F_NFCode] = area.F_NF;
            }
            if (area.condition) {
              postData.FIELDS[area.asbestoBitrixMaping.conditionCode] =
                area.condition;
            }
            if (area.labResults) {
              postData.FIELDS[area.asbestoBitrixMaping.labResultsCode] =
                area.labResults;
            }
            if (area.observations) {
              postData.FIELDS[area.asbestoBitrixMaping.observationsCode] =
                area.observations;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, 32)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async sendMoistureMapping(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: 34,
        IBLOCK_TYPE_ID: "lists",
        FIELDS: {
          NAME: `Moisture Mapping - ${task.id} - ${task.title}`,
          PROPERTY_3528: task.id,
        },
      };

      if (
        task.environmentalForm.moistureMappingAreas.syncInfo.syncCode &&
        parseInt(
          task.environmentalForm.moistureMappingAreas.syncInfo.syncCode
        ) > 0
      ) {
        postData["ELEMENT_ID"] =
          task.environmentalForm.moistureMappingAreas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          34 + "-" + task.id + "-" + (Math.random() * 100).toString();
      }
      if (task.environmentalForm.moistureMappingAreas.contact) {
        postData.FIELDS[
          task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.moistureMappingAreas.dateTesed) {
        postData.FIELDS[
          task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.dateTesedCode
        ] = this.getBitrixDateTime(
          task.environmentalForm.moistureMappingAreas.dateTesed
        );
      }
      if (task.environmentalForm.moistureMappingAreas.inspectionType) {
        postData.FIELDS[
          task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.inspectionTypeCode
        ] = task.environmentalForm.moistureMappingAreas.inspectionType;
      }

      await Promise.all(
        task.environmentalForm.moistureMappingAreas.areamoistureMapping.map(
          async (area: MoistureMapping) => {
            if (area.area) {
              postData.FIELDS[area.moistureMappingBitrixMap.areaCode] =
                area.area;
            }
            if (area.areaOther) {
              postData.FIELDS[area.moistureMappingBitrixMap.areaOtherCode] =
                area.areaOther;
            }

            if (area.roomTemp) {
              postData.FIELDS[area.moistureMappingBitrixMap.roomTempCode] =
                area.roomTemp;
            }
            if (area.relativeHumidity) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.relativeHumidityCode
              ] = area.relativeHumidity;
            }
            if (area.dewPoint) {
              postData.FIELDS[area.moistureMappingBitrixMap.dewPointCode] =
                area.dewPoint;
            }
            if (area.standardTemperatureNorth) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureNorthCode
              ] = area.standardTemperatureNorth;
            }
            if (area.standardTemperatureWest) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureWestCode
              ] = area.standardTemperatureWest;
            }
            if (area.standardTemperatureSouth) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureSouthCode
              ] = area.standardTemperatureSouth;
            }
            if (area.standardTemperatureEast) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureEastCode
              ] = area.standardTemperatureEast;
            }
            if (area.standardTemperatureCeiling) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureCeilingCode
              ] = area.standardTemperatureCeiling;
            }
            if (area.standardTemperatureFloor) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureFloorCode
              ] = area.standardTemperatureFloor;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, 34)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
  async syncDamageAreaImages(areas: DamageAreas, postData: any, list: number) {
    try {
      await Promise.all(
        areas.areasInspection.map(async (area: DamageInspection, index) => {
          if (
            area.areaPictures.imagesCodesSync.find((x) => x.listSync == false)
          ) {
            await Promise.all(
              area.areaPictures.imagesCodesSync
                .filter((x) => x.listSync == false)
                .map(async (element, y) => {
                  postData.FIELDS[
                    area.damageInspectionBitrixMapping.areaPicturesCode
                  ] = [element.file];

                  var response = await this.bitrix
                    .syncDamageAreaInspection(postData, list)
                    .toPromise();

                  if (response && response.result > 0) {
                    areas.areasInspection[index].areaPictures.imagesCodesSync[
                      area.areaPictures.imagesCodesSync.findIndex(
                        (o) => o.file == element.file
                      )
                    ].listSync = true;
                  }
                })
            );
          }
        })
      );
      return areas;
    } catch (error) {
      console.log(error);

      return areas;
    }
  }

  async sendDamageInspection(
    areas: DamageAreas,
    task: InspectionTask,
    type: string,
    list: number,
    name: string
  ): Promise<DamageAreas> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: list,
        IBLOCK_TYPE_ID: "lists",
        FIELDS: {
          NAME: name,
        },
      };
      var damageInspectionList = [];

      if (
        areas.areasInspection.find(
          (x: DamageInspection) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
      ) {
        return areas;
      }
      if (areas.syncInfo.syncCode && areas.syncInfo.syncCode != "") {
        postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          list + "-" + task.id + "-" + (Math.random() * 100).toString();
      }
      damageInspectionList = areas.areasInspection;
      postData.FIELDS[areas.damageAreasBitrixMapping.contactIdCode] =
        task.contactId;
      postData.FIELDS[
        areas.damageAreasBitrixMapping.startDateCode
      ] = this.getBitrixDateTime(task.environmentalForm.startDate);
      postData.FIELDS[areas.damageAreasBitrixMapping.dealIdCode] = task.id;
      postData.FIELDS[areas.damageAreasBitrixMapping.inspectionType] =
        areas.moldInspectionType;

      await Promise.all(
        areas.areasInspection.map(async (area: DamageInspection) => {
          // if (area.areaPictures.imagesCodesSync.length > 0) {
          //   postData.FIELDS[
          //     area.damageInspectionBitrixMapping.areaPicturesCode
          //   ] = area.areaPictures.imagesCodesSync.map((y) => y.file);
          // }
          if (area.areaName) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaNameCode] =
              area.areaName;
          }
          if (area.areaNameOther) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.areaNameOtherCode
            ] = area.areaNameOther;
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
        var result = response.result;
        if (result > 0) {
          areas.syncInfo.syncCode = areas.syncInfo.syncCode
            ? areas.syncInfo.syncCode
            : result.toString();
          postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
          areas.syncInfo.isSync = result > 0;
          areas.syncInfo.updated = false;
          areas = await this.syncDamageAreaImages(areas, postData, list);
          if (
            areas.areasInspection.find((area) =>
              area.areaPictures.imagesCodesSync.find((x) => x.listSync == false)
            )
          ) {
            areas.syncInfo.isSync = false;
            areas.syncInfo.updated = false;
          }
        } else {
          areas.syncInfo.isSync = false;
          areas.syncInfo.updated = false;
        }
      } else {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
      }
      return areas;
    } catch (error) {
      console.log(error);
      areas.syncInfo.isSync = false;
      areas.syncInfo.updated = false;
      return areas;
    }
  }
}
