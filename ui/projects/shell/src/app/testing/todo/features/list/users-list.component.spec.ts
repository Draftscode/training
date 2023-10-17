import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { User } from '../../../../shared/data-access/user';
import { UserState } from '../../data-access/user.state';
import UsersListComponent from './users-list.component';

describe('Users List Component', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let state: UserState;
  let httpMock: HttpTestingController;

  const users: User[] = [{
    username: 'max.mustermann',
    id: 0,
    firstname: 'Max',
    lastname: 'Mustermann',
    age: 32,
    gender: 'male',
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        UsersListComponent,
        NgxsModule.forRoot([UserState]),
        HttpClientTestingModule,
      ],
    });

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    state = TestBed.inject(UserState);

    httpMock = TestBed.inject(HttpTestingController);


  });

  it('should should render', () => {
    expect(component).toBeTruthy();
  });

  it('should should have an title', () => {
    const title = fixture.debugElement.nativeElement.querySelector('[data-test-id=user-list-title]');
    expect(title.innerHTML).toBe('User list with tests');
  });

  it('should should fetch items', () => {
    component['items$'].subscribe(items => {
      expect(items[0].username).toBe('max.mustermann');
    });

    const mockRequest = httpMock.expectOne({ url: '/api/user?limit=100&offset=0&field=id&order=asc&filter=%7B%7D', method: 'GET' });
    mockRequest.flush(users);
  });
});