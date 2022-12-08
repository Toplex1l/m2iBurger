import assert from 'assert';
import app from '../../src/app';

describe('\'restaurant\' service', () => {
  it('registered the service', () => {
    const service = app.service('restaurant');

    assert.ok(service, 'Registered the service');
  });
});
