import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvironmentalInspectionPage } from './environmental-inspection.page';

describe('EnvironmentalInspectionPage', () => {
  let component: EnvironmentalInspectionPage;
  let fixture: ComponentFixture<EnvironmentalInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentalInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnvironmentalInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
