// Initializes the `timezone` service on path `/timezone`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Timezone } from './timezone.class';
import createModel from '../../models/timezone.model';
import hooks from './timezone.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'timezone': Timezone & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/timezone', new Timezone(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('timezone');

  service.hooks(hooks);
}
