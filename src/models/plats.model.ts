// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const plats = sequelizeClient.define(
    'plats',
    {
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prix: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        // allowNull: false,
        defaultValue: false,
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
  (plats as any).associate = function (models: any): void {
    // Define associations here
    plats.hasMany(models.platsingredients, { as: 'platsingredients' });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return plats;
}
