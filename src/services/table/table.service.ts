// Initializes the `table` service on path `/table`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Table } from './table.class';
import createModel from '../../models/table.model';
import hooks from './table.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'table': Table & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/table', new Table(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('table');

  service.hooks(hooks);
}
