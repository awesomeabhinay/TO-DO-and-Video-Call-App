import { TestBed } from '@angular/core/testing';

import { VideoCallService } from './video-call.service';

describe('VideoCallService', () => {
  let service: VideoCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
