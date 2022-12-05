import assert from 'assert';
import app from '../../src/app';

describe('\'commandesplats\' service', () => {
  it('registered the service', () => {
    const service = app.service('commandesplats');

    assert.ok(service, 'Registered the service');
  });
});
