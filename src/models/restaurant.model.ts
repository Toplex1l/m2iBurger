// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const restaurant = sequelizeClient.define(
    'restaurant',
    {
      // A mettre dans la BDD
      // heure d'ouverture 11 h 30
      // => hourStart = 11 * 60 + 30;
      // heure d'fermeture 16 h 30
      // => hourEnd = 16 * 60 + 30;
      // jours de fermeture 1 = lundi (dans un tableau - pour ajouter d'autres dayOff... un jour)
      // => daysOff = [1];
      // horaires de réservation ex : 11h30 12h30 13h30 14h30 15h30 16h30
      // => validHours = [
      //   11 * 60 + 30,
      //   12 * 60 + 30,
      //   13 * 60 + 30,
      //   14 * 60 + 30,
      //   15 * 60 + 30,
      //   16 * 60 + 30,
      // ];
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hourStart: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hourEnd: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dayOff: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (restaurant as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return restaurant;
}
