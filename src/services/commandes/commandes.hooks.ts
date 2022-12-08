import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { ResultSetHeader } from 'mysql2';
import { Sequelize } from 'sequelize';
import { Hook } from 'mocha';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;


///Ajouter commandes et lier le plats et commandes enssemble///

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
    const query = await sequelize.query(`SELECT * from plats WHERE id IN (${platsId})`,{ type: sequelize.SELECT });
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
};

//Mapage des plats retourner par la bdd et envoi d'un boolean pour savoir si tout les plats sont disponiblie ou non
const mapagePlats= (results : any) : boolean => {
  let check = true;
  (results[0].map((res: any, index: any) => {
    //Verification de la disponibilité du plat
    if(res.isAvailable == 0){
      console.log('le plat ' + res.label + 'n\'est pas disponible');
      return check = false;
          
    }
  }));
  return check;
};


//Methode qui si la verification des plats dispo est passer créer la commande
const verificationPlatDispo = (platIsDisponible : boolean)=> {
  if(platIsDisponible == true){
    return Math.floor(Math.random() * 10).toString() + '202212'; 
  }
  else{
    console.log('La commande n\'a pas pu s\'effectuée');
  }
};

//Methode pour lié la commande generer aux plats commandés dans la table commandesplats.
const ajouterCommandesPlats = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const platsId = context.data.platsId;
  const { commandesplats} =
  sequelize.models;
  if(Array.isArray(platsId)){
    platsId.forEach((idPlat: any) => {
      commandesplats.create({'platId': idPlat, 'commandId': context.result.id});
    }); 
  }
  else{
    commandesplats.create({'platId': platsId, 'commandId': context.result.id});
  }
 
  return context;
};
///FIN Ajouter commandes et lier le plats et commandes enssemble///


///Voir la liste des commandes et plats associer///.
//Methode qui permet de voir les plats lié a une commande.
const voirCommandesPLats =  () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const query = await sequelize.query(`SELECT * from commandesplats WHERE commandId = ${context.id}`);
  const platsAssocier = await mapageCommandePlats(query,context).then((data) => data);

  context.result.platsAssocier = platsAssocier;
};

//Mapage de la tablea commandesplats 
const mapageCommandePlats =  async (results : any,context: HookContext)  => {
  const sequelize = context.app.get('sequelizeClient');
  const tabPlatsId : string[] = [];
  results[0].map((res:any,index:any) =>{
    tabPlatsId.push(res.platId);
  });
  const query =  await sequelize.query(`SELECT * from plats WHERE id IN (${tabPlatsId})`);
  return query[0];
};
///FIN voir la liste des commandes et plats associer.

///Suppression des commandes

//Mehtode qui permet de supprimer une commande en bdd.
const supprimerCommande = () => async (context: HookContext) => {
  const sequelize = context.app.get('sequelizeClient');
  const { commandesplats} =
  sequelize.models;
  await commandesplats.destroy({
    where:{commandId : context.id}
  });

  return context;
};
///FIN suppression des commandes.

///Modification d'une commande 

const modififerCommande = () => async (context: HookContext) => {

  const verifPlatDispo = await manageCommandes(context).then(data =>  data);
 
  if(verifPlatDispo){
    const sequelize = context.app.get('sequelizeClient');
    const { commandesplats} =
    sequelize.models;
    await commandesplats.destroy({
      where:{commandId : context.id}
    });
  }
  else{
    context.id = 'undefined';
  }
 
  return context;
};

///FIN modifification d'une commande
export default {
  before: {
    all: [ authenticate('jwt')],
    find: [],
    get: [],
    create: [commanderPlats()],
    update: [],
    patch: [modififerCommande()],
    remove: [supprimerCommande()]
  },

  after: {
    all: [],
    find: [],
    get: [voirCommandesPLats()],
    create: [ajouterCommandesPlats()],
    update: [],
    patch: [ajouterCommandesPlats()],
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
