import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SchedulingDetailPage } from './scheduling-detail.page';

describe('SchedulingDetailPage', () => {
  let component: SchedulingDetailPage;
  let fixture: ComponentFixture<SchedulingDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
