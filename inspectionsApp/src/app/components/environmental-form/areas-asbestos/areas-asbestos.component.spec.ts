import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AreasAsbestosComponent } from './areas-asbestos.component';

describe('AreasAsbestosComponent', () => {
  let component: AreasAsbestosComponent;
  let fixture: ComponentFixture<AreasAsbestosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasAsbestosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasAsbestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
