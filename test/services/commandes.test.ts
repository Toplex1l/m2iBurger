import assert from 'assert';
import app from '../../src/app';

describe('\'commandes\' service', () => {
  it('registered the service', () => {
    const service = app.service('commandes');

    assert.ok(service, 'Registered the service');
  });
});
