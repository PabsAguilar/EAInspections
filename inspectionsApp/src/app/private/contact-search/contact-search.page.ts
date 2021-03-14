import { isNgTemplate } from "@angular/compiler";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Contact } from "src/app/models/contact";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-contact-search",
  templateUrl: "./contact-search.page.html",
  styleUrls: ["./contact-search.page.scss"],
})
export class ContactSearchPage implements OnInit {
  constructor(
    private itestService: ItestDealService,
    private modalController: ModalController // public formBuilder: FormBuilder
  ) {}

  @Input() enterprise: string = "";
  emailSearchText: string = "";
  searching: any = false;
  selectedContact: Contact;
  newContact: Contact = new Contact();
  contactsListFound: Contact[] = [];
  createContact: boolean = false;
  // validations_form = this.formBuilder.group({
  //   firstName: new FormControl("", Validators.compose([Validators.required])),
  // });

  ngOnInit() {}

  async searchEmail() {
    if (this.emailSearchText.length > 1) {
      this.searching = true;
      this.contactsListFound = await this.itestService.getContactsByEmail(
        this.emailSearchText
      );
      this.searching = false;
    }
  }

  // async searchPhone() {
  //   var result = this.itestService.getContactPhone(this.phoneSearchText);
  //   this.scheduling.contact = await result;
  // }
  back() {
    this.confirmContact();
  }

  async selectContact(contactId) {
    this.contactsListFound.forEach((element) => {
      if (element.idContact == contactId) {
        element.selected = true;
        this.selectedContact = element;
      }
    });
  }

  async isContactSelected() {
    return this.selectedContact.idContact;
  }
  async confirmContact() {
    this.modalController.dismiss(this.selectedContact);
  }

  async clearSelectedContact() {
    this.selectedContact = null;
    this.contactsListFound.forEach((item) => (item.selected = false));
  }

  async saveNewContact() {
    this.selectedContact = this.newContact;
  }
}
