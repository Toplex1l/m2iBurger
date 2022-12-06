// import path from 'path';
// import favicon from 'serve-favicon';
// import compress from 'compression';
// import helmet from 'helmet';
// import cors from 'cors';

// import feathers from '@feathersjs/feathers';
// import configuration from '@feathersjs/configuration';
// import express from '@feathersjs/express';
// import socketio from '@feathersjs/socketio';

// import { Application } from './declarations';
// import logger from './logger';
// import middleware from './middleware';
// import services from './services';
// import appHooks from './app.hooks';
// import channels from './channels';
// import { HookContext as FeathersHookContext } from '@feathersjs/feathers';
// import authentication from './authentication';
// import sequelize from './sequelize';
// // Don't remove this comment. It's needed to format import lines nicely.

// const app: Application = express(feathers());
// export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>;

// // Load app configuration
// app.configure(configuration());
// // Enable security, CORS, compression, favicon and body parsing
// app.use(helmet({
//   contentSecurityPolicy: false
// }));
// app.use(cors());
// app.use(compress());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// // Host the public folder
// app.use('/', express.static(app.get('public')));

// // Set up Plugins and providers
// app.configure(express.rest());
// app.configure(socketio());

// app.configure(sequelize);

// // Configure other middleware (see `middleware/index.ts`)
// app.configure(middleware);
// app.configure(authentication);
// // Set up our services (see `services/index.ts`)
// app.configure(services);
// // Set up event channels (see channels.ts)
// app.configure(channels);

// // Configure a middleware for 404s and the error handler
// app.use(express.notFound());
// app.use(express.errorHandler({ logger } as any));

// app.hooks(appHooks);

// export default app;

import feathers from '@feathersjs/feathers';

// This is the interface for the message data
interface Message {
  id?: number;
  text: string;
}

// A messages service that allows to create new
// and return all existing messages
class MessageService {
  messages: Message[] = [];

  async find() {
    // Just return all our messages
    return this.messages;
  }

  async create(data: Pick<Message, 'text'>) {
    // The new message is the data text with a unique identifier added
    // using the messages length since it changes whenever we add one
    const message: Message = {
      id: this.messages.length,
      text: data.text,
    };

    // Add new message to the list
    this.messages.push(message);

    return message;
  }
}

const app = feathers();

// Register the message service on the Feathers application
app.use('messages', new MessageService());

// Log every time a new message has been created
app.service('messages').on('created', (message: Message) => {
  console.log('A new message has been created', message);
});

// A function that creates messages and then logs
// all existing messages on the service
const main = async () => {
  // Create a new message on our message service
  await app.service('messages').create({
    text: 'Hello Feathers',
  });

  // And another one
  await app.service('messages').create({
    text: 'Hello again',
  });

  // Find all existing messages
  const messages = await app.service('messages').find();

  console.log('All messages', messages);
};

main();
