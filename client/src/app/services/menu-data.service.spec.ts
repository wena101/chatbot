/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuDataService } from './menu-data.service';

describe('MenuDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuDataService]
    });
  });

  it('should ...', inject([MenuDataService], (service: MenuDataService) => {
    expect(service).toBeTruthy();
  }));
});
