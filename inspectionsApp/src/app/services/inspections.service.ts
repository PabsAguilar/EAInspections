import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { IStorage } from "../interfaces/Istorage";
import { IStorageModel } from "../interfaces/Istorage-model";
import { InspectionTask } from "../models/inspection-task";
import { GenericStorageService } from "./generic-storage.service";

@Injectable({
  providedIn: "root",
})
export class InspectionsService implements IStorage {
  constructor(private storage: Storage) {}

  collectionName: string = "inspections-task";
  genericStorage: GenericStorageService = new GenericStorageService(
    this.collectionName,
    this.storage
  );

  add(item: InspectionTask): Promise<any> {
    return this.genericStorage.add(item);
  }
  addItems(item: IStorageModel[]): Promise<any> {
    return this.genericStorage.addItems(item);
  }
  update(item: InspectionTask): Promise<any> {
    return this.genericStorage.update(item);
  }
  getAll(): Promise<InspectionTask[]> {
    return this.genericStorage.getAll();
  }
  get(id: number): Promise<InspectionTask> {
    return this.genericStorage.get(id);
  }
  delete(item: any): Promise<InspectionTask> {
    return this.genericStorage.delete(item);
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  syncExternal() {
    return this.genericStorage.addItems(this.getInspectionMockedJson());
  }

  getInspectionMockedJson() {
    var array = [
      {
        id: 0,
        scheduleDateTime: "Wednesday, January 6, 2021 2:26 PM",
        contactName: "Isabelle Joyce",
        name: {
          first: "Chelsea",
          last: "Ramos",
        },
        serviceAddress: "231 Indiana Place, Hamilton, Montana, 446",
        contactPhone: "+1 (895) 453-2100",
        company: "ARCHITAX",
        contactEmail: "chelsea.ramos@architax.biz",
        referalPartnerContact: "Jill Merritt",
        referalPartnerCompany: "ARCHITAX",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Non magna nisi nulla commodo nulla ea reprehenderit qui reprehenderit aliquip amet ea. Ad in id sint ad sit pariatur adipisicing in. Officia officia consectetur laboris ipsum Lorem incididunt ea ullamco do aute eu pariatur. Ipsum ut est nisi ea. Laboris qui aliqua sunt ad sit ex aliquip esse excepteur et aliqua. Et ex officia ea dolore officia occaecat ipsum ullamco proident aute ex aliquip irure.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 1,
        scheduleDateTime: "Sunday, January 31, 2021 4:34 PM",
        contactName: "Bartlett Carpenter",
        name: {
          first: "Knowles",
          last: "Lang",
        },
        serviceAddress: "232 Caton Avenue, Dragoon, Washington, 1766",
        contactPhone: "+1 (986) 566-3347",
        company: "VIRXO",
        contactEmail: "knowles.lang@virxo.com",
        referalPartnerContact: "Curtis Moses",
        referalPartnerCompany: "VIRXO",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Sit sit pariatur officia deserunt consectetur mollit adipisicing velit veniam id minim exercitation deserunt. Irure tempor eiusmod minim laborum Lorem anim mollit enim velit magna. Est id anim occaecat aliquip aute laboris enim deserunt sint anim. Et fugiat ex exercitation in fugiat aliquip dolor aliquip nisi.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 2,
        scheduleDateTime: "Tuesday, January 12, 2021 12:24 AM",
        contactName: "Castillo Mckinney",
        name: {
          first: "Alisa",
          last: "Forbes",
        },
        serviceAddress: "484 Chestnut Avenue, Crenshaw, Michigan, 2107",
        contactPhone: "+1 (992) 534-3428",
        company: "ESCENTA",
        contactEmail: "alisa.forbes@escenta.co.uk",
        referalPartnerContact: "Vincent Mcdaniel",
        referalPartnerCompany: "ESCENTA",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Cupidatat dolore ipsum et cupidatat consequat esse qui dolor est velit. Do officia quis ut incididunt ullamco deserunt. Adipisicing duis tempor excepteur in id ad nisi amet. Esse exercitation aliqua dolor ad incididunt proident aliquip. Aliquip id est proident voluptate.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 3,
        scheduleDateTime: "Tuesday, January 12, 2021 2:19 PM",
        contactName: "Gail Robertson",
        name: {
          first: "Morin",
          last: "Campbell",
        },
        serviceAddress: "583 Clay Street, Glenshaw, Illinois, 3702",
        contactPhone: "+1 (899) 454-3300",
        company: "EBIDCO",
        contactEmail: "morin.campbell@ebidco.net",
        referalPartnerContact: "William Hardin",
        referalPartnerCompany: "EBIDCO",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Veniam do id mollit ut esse fugiat incididunt dolor. Enim mollit culpa fugiat nulla tempor consectetur consectetur voluptate nulla consequat cillum laboris. Et consequat commodo quis proident deserunt veniam voluptate dolore cillum nulla consectetur. Elit sunt amet consequat Lorem et fugiat aliquip culpa dolore proident et ipsum.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 4,
        scheduleDateTime: "Thursday, January 7, 2021 12:17 PM",
        contactName: "Rosanne Cote",
        name: {
          first: "Foster",
          last: "Kline",
        },
        serviceAddress:
          "668 Vandervoort Avenue, Waumandee, Federated States Of Micronesia, 7763",
        contactPhone: "+1 (852) 506-2451",
        company: "ZENSUS",
        contactEmail: "foster.kline@zensus.us",
        referalPartnerContact: "Bolton Sampson",
        referalPartnerCompany: "ZENSUS",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Culpa ex voluptate Lorem eu elit Lorem veniam nulla veniam aliquip esse est id duis. Ea veniam aliqua nulla labore esse id laboris sit Lorem ad quis sunt incididunt. Tempor nostrud ad consequat anim mollit minim ad laborum consectetur.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 5,
        scheduleDateTime: "Friday, February 5, 2021 11:47 AM",
        contactName: "Patty Santiago",
        name: {
          first: "Lorna",
          last: "Colon",
        },
        serviceAddress: "661 Thornton Street, Florence, Pennsylvania, 5961",
        contactPhone: "+1 (914) 588-2421",
        company: "RODEOLOGY",
        contactEmail: "lorna.colon@rodeology.io",
        referalPartnerContact: "Brandie Waller",
        referalPartnerCompany: "RODEOLOGY",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Irure ut sint ut labore dolore dolor cillum cupidatat irure elit labore cupidatat dolor. Dolore est aliquip elit commodo est minim veniam pariatur occaecat sunt culpa. Veniam do non sunt mollit exercitation excepteur aliquip dolore minim in sit sint nulla. Anim dolor laborum sit occaecat qui.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 6,
        scheduleDateTime: "Sunday, January 31, 2021 1:46 PM",
        contactName: "Claudine Ferrell",
        name: {
          first: "Mendez",
          last: "Lindsey",
        },
        serviceAddress: "421 Hegeman Avenue, Linganore, North Dakota, 3263",
        contactPhone: "+1 (896) 520-3081",
        company: "BIZMATIC",
        contactEmail: "mendez.lindsey@bizmatic.info",
        referalPartnerContact: "Ochoa Huber",
        referalPartnerCompany: "BIZMATIC",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Deserunt ea ipsum ipsum nulla ipsum ut est fugiat. Proident ullamco quis labore ullamco excepteur anim nisi. Eiusmod do nisi dolor enim do quis qui labore aliquip commodo est minim et nostrud. Aute adipisicing laborum aute ea sint elit irure id amet magna. Tempor est duis eiusmod dolor.",
        inspectionType: "Environmental Inspection",
      },
    ];
    return array;
  }
}
