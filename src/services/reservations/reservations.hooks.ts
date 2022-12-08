import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { Op, QueryTypes } from 'sequelize';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

// heure d'ouverture 11 h 30
const hourStart = 11 * 60 + 30;
// heure d'fermeture 16 h 30
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
let tableAvailable: Array<number> = [];
const isValid = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const { table } = sequelize.models;

  // Vérifier la partie date
  const today = new Date();
  const dateParam = new Date(context.data.horaire);
  const nbrParam = context.data.nbrPersonne;
  const time = dateParam.getHours() * 60 + dateParam.getMinutes();
  const day = dateParam.getDay();
  if (dateParam.getTime() < today.getTime()) {
    // Retourne une erreur et bloque la creation
    throw new Error('Réservez dans le futur');
  }
  let throwError = true;
  validHours.map((validHour) => {
    if (validHour == time) {
      throwError = false;
      // ... TODO ... => créer table Restaurant avec les zone de réservation, les jours d'ouverture et les heures d'ouverture
    }
  });
  if (throwError) {
    throw new Error('Réservez pendant les zone de réservation');
  }
  daysOff.map((dayOff) => {
    if (dayOff == day) {
      throw new Error('Réservez pendant les jours d\'ouverture');
    }
  });
  if (!(time >= hourStart && time < hourEnd)) {
    throw new Error('Réservez pendant les heures d\'ouverture');
  }

  // Vérifie si la table est disponible à la date et heure demandé

  let tableIds: Array<number> = [];

  const reservedtableIds = await sequelize.query(
    '  SELECT TR.tableId FROM m_2_i_burger.TableReservations as TR INNER JOIN m_2_i_burger.reservations as R ON TR.reservationId = R.id INNER JOIN m_2_i_burger.table as T ON TR.tableId = T.id WHERE R.horaire = \'2023-09-29 10:30:00\'',
    { type: QueryTypes.SELECT }
  );

  reservedtableIds.map((table: any) => {
    tableIds = [...tableIds, table.tableId];
  });

  console.log('tableIds', tableIds);

  const tableReservedPromises = (tableIdsArg: any) => {
    return table
      .findAll({
        attributes: ['id', 'taille'],
        raw: true,
        where: {
          [Op.and]: [
            {
              taille: { [Op.gte]: nbrParam },
              id: { [Op.notIn]: tableIdsArg },
            },
          ],
        },
      })
      .then((values: any) => {
        tableAvailable = [];
        values.map((table: any) => {
          tableAvailable = [...tableAvailable, table.id];
        });
        if (tableAvailable.length == 0) {
          throw new Error('Plus de place pour cet horaire');
        } else {
          return tableAvailable;
        }
      })
      .catch(() => {
        throw new Error('Plus de place pour cet horaire');
      });
  };

  tableReservedPromises(tableIds);

  return context;
};

const includeAssociations = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');

  const { table } = sequelize.models;

  context.params.sequelize = {
    include: [{ model: table, as: 'tables' }],
    raw: false,
  };

  return context;
};

const createTableReservation = () => async (context: HookContext) => {
  // console.log('values',"afterContextresultid", context.result.id);
  // console.log('values',"afterContext", context);

  // Prendre la première table de libre
  const sequelize = context.app.get('sequelizeClient');
  const { TableReservations } = sequelize.models;
  console.log('tableAvailable', tableAvailable);
  if (tableAvailable.length > 0) {
    await TableReservations.create({
      tableId: tableAvailable[0],
      reservationId: context.result.id,
    });
    return context;
  } else {
    throw new Error('Plus de place pour cet horaire');
  }
};

export default {
  before: {
    all: [authenticate('jwt')],
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
    create: [createTableReservation()],
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
