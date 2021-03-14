import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanySearchPage } from './company-search.page';

describe('CompanySearchPage', () => {
  let component: CompanySearchPage;
  let fixture: ComponentFixture<CompanySearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
