import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComprehensiveInspectionPage } from './comprehensive-inspection.page';

describe('ComprehensiveInspectionPage', () => {
  let component: ComprehensiveInspectionPage;
  let fixture: ComponentFixture<ComprehensiveInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprehensiveInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComprehensiveInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
