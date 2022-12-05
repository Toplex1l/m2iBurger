import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const checkStock = () => async (context:HookContext) => {
  const newStock = context.data.stock
  const sequelize = context.app.get("sequelizeClient");
  const { platsingredients, plats } = sequelize.models;

    if(newStock < 10){
      context.data.stockAlert = true
      const [results, metadata] = await sequelize.query(`SELECT platid from platsingredients WHERE ingredientid = ${context.id}`);
      
      (results.map((res:any, index:any) => {
        try{
          plats.update({
            isAvailable: false
          },
          {
            where: {  
              id: res.platid ,
            },
          })

        }catch(error){
          console.log(error)
        }
      })
      )
      console.log("L'ingredient doit être recommander ")
    }else{
      context.data.stockAlert = false
      /* const [results, metadata] = await sequelize.query(`SELECT platid from platsingredients WHERE ingredientid = ${context.id}`);
      
      (results.map((res:any, index:any) => {
        try{
          plats.update({
            isAvailable: true
          },
          {
            where: {  
              id: res.platid ,
            },
          })

        }catch(error){
          console.log(error)
        }
      })
      )
 */
    }

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
