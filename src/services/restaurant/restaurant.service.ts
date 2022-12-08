// Initializes the `restaurant` service on path `/restaurant`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Restaurant } from './restaurant.class';
import createModel from '../../models/restaurant.model';
import hooks from './restaurant.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'restaurant': Restaurant & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/restaurant', new Restaurant(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('restaurant');

  service.hooks(hooks);
}
