import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvironmentalAgreementsPage } from './environmental-agreements.page';

describe('EnvironmentalAgreementsPage', () => {
  let component: EnvironmentalAgreementsPage;
  let fixture: ComponentFixture<EnvironmentalAgreementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentalAgreementsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnvironmentalAgreementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
