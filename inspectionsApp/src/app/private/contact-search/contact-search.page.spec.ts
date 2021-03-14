import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactSearchPage } from './contact-search.page';

describe('ContactSearchPage', () => {
  let component: ContactSearchPage;
  let fixture: ComponentFixture<ContactSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
