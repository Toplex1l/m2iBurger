import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { Op, QueryTypes } from 'sequelize';
import { format } from 'date-fns';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

// heure d'ouverture 11 h 30
const hourStart = 11 * 60 + 30;
// heure d'fermeture 16 h 30
const hourEnd = 16 * 60 + 30;
// jours de fermeture 1 = lundi (dans un tableau - pour ajouter d'autres dayOff... un jour)
const dayOff = [1];
// horaires de réservation ex : 11h30 12h30 13h30 14h30 15h30 16h30
// const validHours = [
//   11 * 60 + 30,
//   12 * 60 + 30,
//   13 * 60 + 30,
//   14 * 60 + 30,
//   15 * 60 + 30,
//   16 * 60 + 30,
// ];

// Vérifier si l'heure de réservation est possible
let tableAvailable: Array<number> = [];
const isValid = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const { table, restaurant } = sequelize.models;

  // Vérifier la partie date
  const today = new Date();
  const dateParam = new Date(context.data.horaire);
  dateParam.setHours(
    (dateParam.getHours() * 60 + dateParam.getTimezoneOffset()) / 60
  );
  let validHours: number[] = [];
  const nbrParam = context.data.nbrPersonne;
  const time = dateParam.getHours() * 60 + dateParam.getMinutes();
  const day = dateParam.getDay();

  //R.id = 1 => restaurant m2i Burger
  const validHoursCall = await sequelize.query(
    `SELECT T.validHour
    FROM m_2_i_burger.restaurant as R
    INNER JOIN m_2_i_burger.timezone as T ON R.id = T.restaurantId
    WHERE R.id = 1`,
    { type: QueryTypes.SELECT }
  );

  const restauData = await sequelize.query(
    `SELECT *
    FROM m_2_i_burger.restaurant as R
    WHERE R.id = 1`,
    { type: QueryTypes.SELECT }
  );

  validHoursCall.map((item: any) => {
    console.log(item.validHour);
    validHours = [...validHours, item.validHour];
  });

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
  dayOff.map((dayOff) => {
    if (dayOff == day) {
      throw new Error('Réservez pendant les jours d\'ouverture');
    }
  });
  if (!(time >= hourStart && time < hourEnd)) {
    throw new Error('Réservez pendant les heures d\'ouverture');
  }

  // Vérifie si la table est disponible à la date et heure demandé

  let tableIds: Array<number> = [];

  console.log(format(dateParam, 'yyyy-MM-dd HH:mm:SS'));

  const reservedtableIds = await sequelize.query(
    `SELECT TR.tableId FROM m_2_i_burger.TableReservations as TR INNER JOIN m_2_i_burger.reservations as R ON TR.reservationId = R.id INNER JOIN m_2_i_burger.table as T ON TR.tableId = T.id WHERE R.horaire = "${format(
      dateParam,
      'yyyy-MM-dd HH:mm:SS'
    )}"`,
    { type: QueryTypes.SELECT }
  );

  reservedtableIds.map((table: any) => {
    tableIds = [...tableIds, table.tableId];
  });
  const tableToReserve = (tableIdsArg: any) => {
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

  tableToReserve(tableIds);

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
  // Prendre la première table de libre
  const sequelize = context.app.get('sequelizeClient');
  const { TableReservations } = sequelize.models;
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

const showOnlyValidReservation = () => async (context: HookContext) => {
  console.log('context', context);
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [includeAssociations()],
    get: [includeAssociations(), showOnlyValidReservation()],
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
