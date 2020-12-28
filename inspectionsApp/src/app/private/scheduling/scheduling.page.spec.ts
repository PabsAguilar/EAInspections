import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SchedulingPage } from './scheduling.page';

describe('SchedulingPage', () => {
  let component: SchedulingPage;
  let fixture: ComponentFixture<SchedulingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
