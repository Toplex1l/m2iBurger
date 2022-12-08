// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const reservations = sequelizeClient.define('reservations', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    horaire: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (reservations as any).associate = function (models: any): void {
    // Define associations here
    reservations.belongsTo(models.users, { as: 'user' });
    reservations.belongsTo(models.table, { as: 'table' });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return reservations;
}
