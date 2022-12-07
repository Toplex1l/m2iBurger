import assert from 'assert';
import app from '../../src/app';

describe('\'cmd-supplies\' service', () => {
  it('registered the service', () => {
    const service = app.service('cmd-supplies');

    assert.ok(service, 'Registered the service');
  });
});
