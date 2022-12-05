// Initializes the `reservations` service on path `/reservations`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Reservations } from './reservations.class';
import createModel from '../../models/reservations.model';
import hooks from './reservations.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'reservations': Reservations & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/reservations', new Reservations(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('reservations');

  service.hooks(hooks);
}
