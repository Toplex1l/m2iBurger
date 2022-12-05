import { Application } from '../declarations';
import users from './users/users.service';
import ingredients from './ingredients/ingredients.service';
import plats from './plats/plats.service';
import platsingredients from './platsingredients/platsingredients.service';
import commandes from './commandes/commandes.service';
import commandesplats from './commandesplats/commandesplats.service';
import table from './table/table.service';
import reservations from './reservations/reservations.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(ingredients);
  app.configure(plats);
  app.configure(platsingredients);
  app.configure(commandes);
  app.configure(commandesplats);
  app.configure(table);
  app.configure(reservations);
}
