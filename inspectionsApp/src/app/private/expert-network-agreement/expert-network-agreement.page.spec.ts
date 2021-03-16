import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpertNetworkAgreementPage } from './expert-network-agreement.page';

describe('ExpertNetworkAgreementPage', () => {
  let component: ExpertNetworkAgreementPage;
  let fixture: ComponentFixture<ExpertNetworkAgreementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertNetworkAgreementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertNetworkAgreementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
