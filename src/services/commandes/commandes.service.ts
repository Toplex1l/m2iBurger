// Initializes the `commandes` service on path `/commandes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Commandes } from './commandes.class';
import createModel from '../../models/commandes.model';
import hooks from './commandes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'commandes': Commandes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/commandes', new Commandes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('commandes');

  service.hooks(hooks);
}
