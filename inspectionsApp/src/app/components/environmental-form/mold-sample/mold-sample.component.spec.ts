import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoldSampleComponent } from './mold-sample.component';

describe('MoldSampleComponent', () => {
  let component: MoldSampleComponent;
  let fixture: ComponentFixture<MoldSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoldSampleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoldSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
