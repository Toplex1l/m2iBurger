import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;


const includeAssociations = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');

  const { platsingredients } = sequelize.models;

  context.params.sequelize = {
    include: [
      { model: platsingredients, as: 'platsingredients' },

    ],
    raw: false,
  };

  return context;
};


const checkDispo = () => async (context:HookContext) => {
  /* const sequelize = context.app.get("sequelizeClient");
  const { platsingredients } = sequelize.models;

  if(context.method === 'get'){
    console.log("get")
    //Sur id 
    try{
      const [data] = await platsingredients.findAll({
        attributes: ['id'],
        where: {
          platId: context.id
        }
      })

      console.log(data)
    }catch(error){
     
    }
  }else{
    console.log("find")
    //general 
  }
  
  
  
  console.log("checked")
 */

  return context
}


export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [includeAssociations(), checkDispo()],
    get: [includeAssociations(), checkDispo()],
    create: [],
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
