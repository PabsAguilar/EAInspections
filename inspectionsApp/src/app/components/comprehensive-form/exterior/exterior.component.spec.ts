import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExteriorComponent } from './exterior.component';

describe('ExteriorComponent', () => {
  let component: ExteriorComponent;
  let fixture: ComponentFixture<ExteriorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExteriorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
