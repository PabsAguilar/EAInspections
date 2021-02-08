import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsbestosComponent } from './asbestos.component';

describe('AsbestosComponent', () => {
  let component: AsbestosComponent;
  let fixture: ComponentFixture<AsbestosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsbestosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsbestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
