import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadComponent } from './lead.component';

describe('LeadComponent', () => {
  let component: LeadComponent;
  let fixture: ComponentFixture<LeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
