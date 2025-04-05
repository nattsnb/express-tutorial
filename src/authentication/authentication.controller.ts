import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import User from "users/user.interface";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import Controller from "../interfaces/controller.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken.interface";
import TokenData from "../interfaces/tokenData.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../users/user.dto";
import userModel from "./../users/user.model";
import LogInDto from "./logIn.dto";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration,
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn,
    );
    this.router.post(`${this.path}/logout`, this.loggingOut);
    this.router.get(`${this.path}/me`, authMiddleware, this.getMe);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      response.send(user);
    }
  };

  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (!user) {
      return next(new WrongCredentialsException());
    }
    const isPasswordMatching = await bcrypt.compare(
      logInData.password,
      user.password,
    );
    if (!isPasswordMatching) {
      return next(new WrongCredentialsException());
    }
    user.password = undefined;
    const tokenData = this.createToken(user);
    response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
    response.send({ user });
  };

  private loggingOut = (
    request: express.Request,
    response: express.Response,
  ) => {
    response.setHeader("Set-Cookie", [
      "Authorization=;Max-age=0;HttpOnly;Path=/",
    ]);
    response.sendStatus(200);
  };

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id.toString(),
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private getMe(request: RequestWithUser, response: express.Response) {
    const user = request.user;
    if (user) {
      const { password, ...userWithoutPassword } = user;
      response.send(userWithoutPassword);
    } else {
      response.sendStatus(401);
    }
  }
}

export default AuthenticationController;
