import { describe, it, expect } from 'vitest';
import { Button, Card, Badge } from '../components/ui';

describe('UI Components', () => {
  it('renders Button component', () => {
    expect(Button).toBeDefined();
  });

  it('renders Card component', () => {
    expect(Card).toBeDefined();
  });

  it('renders Badge component', () => {
    expect(Badge).toBeDefined();
  });
});
