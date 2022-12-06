import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const checkStock = () => async (context:HookContext) => {
/*   const sequelize = context.app.get("sequelizeClient");
  const ingredients = sequelize.models.ingredients;
  
  const currentData = await ingredients.findByPk(context.id);

  const previousStock = currentData.dataValues.stock */
  /*  const newStock = context.data.stock

  if(newStock < 10){
    console.log("flag")
    const stockAlert = true 
    
  } */

  console.log(context.data);
  return context;
};



export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [checkStock()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
