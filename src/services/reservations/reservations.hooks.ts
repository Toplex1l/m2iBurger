import { HookContext } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
// heure d'ouverture 11 h 30
const hourStart = 11 * 60 + 30;
// heure d'fermeture 16h 30
const hourEnd = 16 * 60 + 30;
// jours de fermeture 1 = lundi et 4 = jeudi
const daysOff = [1, 4];
// horaires de réservation ex : 11h30 12h30 13h30 14h30 15h30 16h30
const validHours = [
  11 * 60 + 30,
  12 * 60 + 30,
  13 * 60 + 30,
  14 * 60 + 30,
  15 * 60 + 30,
  16 * 60 + 30,
];

// Vérifier si l'heure de réservation est possible
const isValid = () => async (context: HookContext) => {
  // Vérifier la partie date
  const today = new Date();
  const dateParam = new Date(context.data.horaire);
  console.log("data", dateParam);
  const time = dateParam.getHours() * 60 + dateParam.getMinutes();
  console.log("time", time);
  console.log(new Date(), time);
  const day = dateParam.getDay();
  if (dateParam.getTime() < today.getTime()) {
    // Retourne une erreur et bloque la creation
    throw new Error("Réservez dans le futur");
  }
  validHours.map((validHour) => {
    if (validHour == time) {
      throw new Error("Réservez pendant les zone de réservation");
      // ... TODO ... => créer table Restaurant avec les zone de réservation, les jours d'ouverture et les heures d'ouverture
    }
  });
  daysOff.map((dayOff) => {
    if (dayOff == day) {
      throw new Error("Réservez pendant les jours d'ouverture");
    }
  });
  if (!(time >= hourStart && time < hourEnd)) {
    throw new Error("Réservez pendant les heures d'ouverture");
  }
  // Vérifiez la partie table
  const tableParam = new Date(context.data.horaire);

  return context;
};

// ...TODO... => Chercher la table est voir si elle est disponible à la date et heure demandé

const includeAssociations = () => async (context: HookContext) => {
  const sequelize = context.app.get("sequelizeClient");

  const { table } = sequelize.models;

  context.params.sequelize = {
    include: [{ model: table, as: "tables" }],
    raw: false,
  };

  return context;
};

export default {
  before: {
    all: [authenticate("jwt")],
    find: [includeAssociations()],
    get: [includeAssociations()],
    create: [isValid()],
    update: [isValid()],
    patch: [isValid()],
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
