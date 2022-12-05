import assert from 'assert';
import app from '../../src/app';

describe('\'table\' service', () => {
  it('registered the service', () => {
    const service = app.service('table');

    assert.ok(service, 'Registered the service');
  });
});
