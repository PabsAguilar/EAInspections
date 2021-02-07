import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreasMoldComponent } from './areas-mold.component';

describe('AreasMoldComponent', () => {
  let component: AreasMoldComponent;
  let fixture: ComponentFixture<AreasMoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasMoldComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasMoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
