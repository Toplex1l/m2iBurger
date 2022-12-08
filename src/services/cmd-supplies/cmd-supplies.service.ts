// Initializes the `cmd-supplies` service on path `/cmd-supplies`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CmdSupplies } from './cmd-supplies.class';
import createModel from '../../models/cmd-supplies.model';
import hooks from './cmd-supplies.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'cmd-supplies': CmdSupplies & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cmd-supplies', new CmdSupplies(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cmd-supplies');

  service.hooks(hooks);
}
