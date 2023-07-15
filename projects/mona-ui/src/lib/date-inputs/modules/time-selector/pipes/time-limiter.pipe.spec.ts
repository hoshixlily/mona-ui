import { TimeLimiterPipe } from './time-limiter.pipe';

describe('TimeLimiterPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeLimiterPipe();
    expect(pipe).toBeTruthy();
  });
});
