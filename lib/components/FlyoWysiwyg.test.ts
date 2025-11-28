import { describe, it, expect } from 'vitest';
import FlyoWysiwyg from './FlyoWysiwyg';
import { wysiwyg } from '@flyo/nitro-js-bridge';

describe('FlyoWysiwyg', () => {
  it('should export the component', () => {
    expect(FlyoWysiwyg).toBeDefined();
  });

  it('wysiwyg function should be available and render basic node', () => {
    expect(wysiwyg).toBeDefined();
    
    const node = { 
      type: 'paragraph', 
      content: [{ type: 'text', text: 'Hello World' }] 
    };
    
    // Since we don't know the exact implementation details of the installed version,
    // we just check if it returns a string containing the text.
    const html = wysiwyg(node);
    expect(typeof html).toBe('string');
    expect(html).toContain('Hello World');
  });
});
