import config from '../vite.config';
import { describe, it, expect } from 'vitest';

describe('vite config', () => {
  it('has correct base path', () => {
    expect(config.base).toBe('/Geopolitics/');
  });
});
