import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreaGeneralConditionComponent } from './area-general-condition.component';

describe('AreaGeneralConditionComponent', () => {
  let component: AreaGeneralConditionComponent;
  let fixture: ComponentFixture<AreaGeneralConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaGeneralConditionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaGeneralConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
