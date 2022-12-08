import { HookContext, HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const addInfo = () => async (context:HookContext) => {
  //Ajoute la ref sur le create de la commande
  const sequelize = context.app.get("sequelizeClient");
  
  const [results, metadata] = await sequelize.query(`SELECT label from ingredients WHERE id = ${context.data.ingredientId}`);

  const date = Date.now()
  const ref = `cmd-${results[0].label}-${date}`

  context.data.ref = ref;
  return context
};

const statusChange = () => async (context:HookContext) => {
  //Impute le stock quand la commande d'ingredient est reçue
  const sequelize = context.app.get("sequelizeClient");
  const [results, metadata] = await sequelize.query(`SELECT stock from ingredients WHERE id = ${context.result.ingredientId}`);
  const { ingredients } = sequelize.models;

  const newStock = results[0].stock + context.result.quantity;

  if(context.data.isReceived === true){
    try{
      if(context.params.headers){
        const token = context.params.headers.authorization
        const axios = require('axios').default;

        let reqInstance = axios.create({
          headers: {
            Authorization : token 
            }
          }
        )
        const url = `http://localhost:3030/ingredients/${context.result.ingredientId}`
        const myBody = {stock:newStock}
        
        await reqInstance.patch(url,myBody);
      }


    }catch(error){
      console.log(error)
    }
  }


  return context
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addInfo()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [statusChange()],
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
