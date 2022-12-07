import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { ResultSetHeader } from 'mysql2';
import { Sequelize } from 'sequelize';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

//Methode pour generer la commande avant de la lié avec le plat 
const commanderPlats = () => async (context: HookContext) => {
    context.data.ref = await manageCommandes(context).then(data =>  data);
    return context;  
};

const manageCommandes = async (context : HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const platsId = context.data.platsId;
  let platsDisponible = true;
  //Si il y'a plusieur plat envoyé on parcours le tableau
    if(Array.isArray(platsId)){
      //recherche en bdd les plats choisis
      const query = await sequelize.query(`SELECT * from plats WHERE id IN (${platsId})`,{ type: sequelize.SELECT })
      //Mapage des plat trouvé et verification de leur disponibilité 
      platsDisponible = mapagePlats(query);
      //Création de la commande si plats dispo
      return verificationPlatDispo(platsDisponible); 
  }
  //Sinon un seul plat
  else{
      //Recherche en bdd le plat choisi
      const query = await sequelize.query(`SELECT * from plats WHERE id = ${platsId}`);
      //Mapage des plat trouvé et verification de leur disponibilité 
      platsDisponible = mapagePlats(query);
      //Création de la commande si plats dispo
      return verificationPlatDispo(platsDisponible); 
  }
}

//Mapage des plats retourner par la bdd et envoi d'un boolean pour savoir si tout les plats sont disponiblie ou non
const mapagePlats= (results : any) : boolean => {
  let check = true;
  (results[0].map((res: any, index: any) => {
    //Verification de la disponibilité du plat
    if(res.isAvailable == 0){
      console.log("le plat " + res.label + "n'est pas disponible");
      return check = false;
          
    }
  }))
  return check;
}

//Methode qui si la verification des plats dispo est passer créer la commande
const verificationPlatDispo = (platIsDisponible : boolean)=> {
  if(platIsDisponible == true){
   return Math.floor(Math.random() * 10).toString() + "202212"; 
  }
  else{
    console.log("La commande n'a pas pu s'effectuée");
  }
}

//Methode pour lié la commande generer aux plats commandés dans la table commandesplats.
const ajouterCommandesPlats = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const platsId = context.data.platsId;
  const { commandesplats} =
  sequelize.models;
  if(Array.isArray(platsId)){
    platsId.forEach((idPlat: any) => {
      commandesplats.create({"platId": idPlat, "commandId": context.result.id});
    }) 
  }
  else{
    commandesplats.create({"platId": platsId, "commandId": context.result.id});
  }
 
  return context;
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [commanderPlats()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ajouterCommandesPlats()],
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
