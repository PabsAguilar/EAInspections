import { Company } from "../models/company";
import { Contact } from "../models/contact";
import { InspectionTask } from "../models/inspection-task";
import { TaskSubtype } from "../models/task-subtype";
import { GenericStorageService } from "../services/generic-storage.service";

export interface IDealService {
  inspectionFieldsName: string;
  dealFieldName: string;
  collectionTaskSubTypesName: string;
  inspectionTypesListService: GenericStorageService;
  inspectionFieldsListService: GenericStorageService;
  dealsFieldsListService: GenericStorageService;

  update(task: InspectionTask);

  getContactPhone(phone: string): Promise<Contact>;

  getCompaniesByName(name: string): Promise<Company[]>;

  getContactsByEmail(email: string): Promise<Contact[]>;
  getPendingInspections(userId: number);

  getCompletedInspections();

  getStartedInspections();

  getInspectionTasksTypesList(): Promise<TaskSubtype[]>;

  getInspectionTasksTypesListFromServer(): Promise<TaskSubtype[]>;
  initializeAsbestosMapping(task: InspectionTask): Promise<InspectionTask>;

  initializeLead(task: InspectionTask): Promise<InspectionTask>;

  initializeMoistureMapping(task: InspectionTask): Promise<InspectionTask>;

  initializeDamageMapping(
    damageType: string,
    task: InspectionTask
  ): Promise<InspectionTask>;

  initializeEnvironmentalTask(task: InspectionTask): Promise<InspectionTask>;

  getEnvironmentalInspectionFields(): Promise<any>;
  getDealsFields(): Promise<any>;
  getDealsFieldsFromServer(): Promise<any>;

  getExternal(idUser: number);
  getSyncStamp();

  getBitrixContact(contactId: string): Promise<Contact>;

  getBitrixCompany(companyId: string): Promise<Company>;

  getInspectionITestJson(idUser: number): Promise<InspectionTask[]>;
}
