import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from "./users.model";
import User from "./user.interface";
import * as bcrypt from 'bcrypt';

const saltRounds = 10;


class UserController implements Controller {
  public path = '/users';
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.createUser);
  }

  private createUser = (request: express.Request, response: express.Response) => {
    const userData: User = request.body;
    userData.password
    const createdUser = new this.user(userData);
    createdUser.save()
      .then((savedUser) => {
        response.send(savedUser);
      });
  }
}

export default UserController;