import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const checkStock = () => async (context:HookContext) => {
<<<<<<< HEAD

  const newStock = context.data.stock
  const sequelize = context.app.get("sequelizeClient");
  const { cmd_supplies, plats } = sequelize.models;

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
=======
  const newStock = context.data.stock;
  
  if(newStock < 10){
    context.data.stockAlert = true;
  }else{
    context.data.stockAlert = false;
  }
>>>>>>> feature/devMehdi

    }else{
      context.data.stockAlert = false

      const [res] = await sequelize.query(`SELECT platid from platsingredients WHERE ingredientid = ${context.id}`);
      (res.map((item:any, index:any) => {
        try{
          plats.update({
            isAvailable: true
          },
          {
            where: {  
              id: item.platid ,
            },
          })
        }catch(error){
          console.log(error)
        }
      })
      )
    }
  return context;
};


const setPlatOff = ()  => async (context:HookContext) => {
  const sequelize = context.app.get("sequelizeClient");
  const { plats } = sequelize.models;
  const [results, metadata] = await sequelize.query(`SELECT platId FROM platsingredients INNER JOIN ingredients ON ingredients.id = platsingredients.ingredientId WHERE stockAlert = 1;`);
  if(results){
    results.map((item:any, index:any) => {
      try{
        plats.update({
          isAvailable: false
        },
        {
          where: {  
            id: item.platId ,
          },
        })
      }catch(error){
        console.log(error)
      }
    })
  }
  return context
}
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
    patch: [setPlatOff()],
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
