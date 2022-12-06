import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;


const includeAssociations = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');

  const { platsingredients } =
    sequelize.models;

  context.params.sequelize = {
    include: [
      { model: platsingredients, as: 'platsingredients' },

    ],
    raw: false,
  };

  return context;
};



export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [includeAssociations()],
    get: [includeAssociations()],
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
