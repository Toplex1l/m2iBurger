import assert from 'assert';
import app from '../../src/app';

describe('\'ingredients\' service', () => {
  it('registered the service', () => {
    const service = app.service('ingredients');

    assert.ok(service, 'Registered the service');
  });
});
