import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartInspectionPage } from './start-inspection.page';

describe('StartInspectionPage', () => {
  let component: StartInspectionPage;
  let fixture: ComponentFixture<StartInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
