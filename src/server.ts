import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';
import UserController from "./users/users.controller";

validateEnv();

const app = new App(
  [
    new PostsController(),
    new UserController(),
  ],
);

app.listen();