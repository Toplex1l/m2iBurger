// Initializes the `commandesplats` service on path `/commandesplats`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Commandesplats } from './commandesplats.class';
import createModel from '../../models/commandesplats.model';
import hooks from './commandesplats.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'commandesplats': Commandesplats & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/commandesplats', new Commandesplats(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('commandesplats');

  service.hooks(hooks);
}
