import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from "./user.model";
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
    this.router.get(this.path, this.getAllUsers);
  }

  private createUser = async (request: express.Request, response: express.Response) => {
    const userData: User = request.body;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    const createdUser = new this.user(userData);
    const savedUser = await createdUser.save();
    response.send(savedUser);
  }

  private getAllUsers = async (request: express.Request, response: express.Response) => {
    this.user.find()
      .then((users) => {
        response.send(users);
      });
  }
}

export default UserController;