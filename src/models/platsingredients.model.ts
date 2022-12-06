// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const platsingredients = sequelizeClient.define('platsingredients', {
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    platId: {
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
  (platsingredients as any).associate = function (models: any): void {
    // Define associations here
    platsingredients.belongsTo(models.ingredients, { as: 'ingredient' });
    platsingredients.belongsTo(models.plats, { as: 'plat' });
    
    // See https://sequelize.org/master/manual/assocs.html
  };

  return platsingredients;
}
