// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const commandesplats = sequelizeClient.define('commandesplats', {
    platId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commandId: {
      type: DataTypes.INTEGER,
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
  (commandesplats as any).associate = function (models: any): void {
    // Define associations here
    commandesplats.belongsTo(models.plats, { as: "plat" });
    commandesplats.belongsTo(models.commandes, { as: "command" });
    // See https://sequelize.org/master/manual/assocs.html
  };

  return commandesplats;
}
