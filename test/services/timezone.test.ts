import assert from 'assert';
import app from '../../src/app';

describe('\'timezone\' service', () => {
  it('registered the service', () => {
    const service = app.service('timezone');

    assert.ok(service, 'Registered the service');
  });
});
