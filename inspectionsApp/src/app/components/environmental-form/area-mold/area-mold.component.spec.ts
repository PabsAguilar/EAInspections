import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreaMoldComponent } from './area-mold.component';

describe('AreaMoldComponent', () => {
  let component: AreaMoldComponent;
  let fixture: ComponentFixture<AreaMoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaMoldComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaMoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
