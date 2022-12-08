import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const includeAssociations = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');

  const { ingredients, plats } = sequelize.models;

  context.params.sequelize = {
    include: [
      { model: plats, as: 'plat' },
      { model: ingredients, as: 'ingredient' },
    ],
    raw: false,
  };

  return context;
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [includeAssociations()],
    get: [includeAssociations()],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
