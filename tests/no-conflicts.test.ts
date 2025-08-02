import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('no merge conflict markers', () => {
  it('repository should not contain conflict markers', () => {
    const result = execSync("rg -l '<<<<<<<' || true", { encoding: 'utf8' }).trim();
    expect(result).toBe('');
  });
});
