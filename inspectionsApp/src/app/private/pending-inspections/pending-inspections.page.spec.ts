import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PendingInspectionsPage } from './pending-inspections.page';

describe('PendingInspectionsPage', () => {
  let component: PendingInspectionsPage;
  let fixture: ComponentFixture<PendingInspectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingInspectionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingInspectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
