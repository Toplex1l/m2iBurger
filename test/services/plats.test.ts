import assert from 'assert';
import app from '../../src/app';

describe('\'plats\' service', () => {
  it('registered the service', () => {
    const service = app.service('plats');

    assert.ok(service, 'Registered the service');
  });
});
