import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetupBitrixTokenPage } from './setup-bitrix-token.page';

describe('SetupBitrixTokenPage', () => {
  let component: SetupBitrixTokenPage;
  let fixture: ComponentFixture<SetupBitrixTokenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupBitrixTokenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetupBitrixTokenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
