import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreasLeadComponent } from './areas-lead.component';

describe('AreasLeadComponent', () => {
  let component: AreasLeadComponent;
  let fixture: ComponentFixture<AreasLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasLeadComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
