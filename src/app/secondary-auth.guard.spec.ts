import { TestBed } from '@angular/core/testing';

import { SecondaryAuthGuard } from './secondary-auth.guard';

describe('SecondaryAuthGuard', () => {
  let guard: SecondaryAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecondaryAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
