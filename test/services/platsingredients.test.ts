import assert from 'assert';
import app from '../../src/app';

describe('\'platsingredients\' service', () => {
  it('registered the service', () => {
    const service = app.service('platsingredients');

    assert.ok(service, 'Registered the service');
  });
});
