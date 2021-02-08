import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreasMoistureMappingComponent } from './areas-moisture-mapping.component';

describe('AreasMoistureMappingComponent', () => {
  let component: AreasMoistureMappingComponent;
  let fixture: ComponentFixture<AreasMoistureMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasMoistureMappingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasMoistureMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
