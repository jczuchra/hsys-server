import { DataSource } from 'apollo-datasource';
import bcrypt from 'bcrypt';
import isEmail from 'isemail';
import jwt from 'jsonwebtoken';
import messages from '../utils/messages';

const userMessages = messages["server.src.datasources.user"];

class UserAPI extends DataSource {
  constructor({ models }) {
    super();
    this.store = models;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async registerUser({ email: emailArg, password, } = {}) {
    const email = this.context && this.context.user ? this.context.user.email : emailArg;
    const salt = await bcrypt.genSalt();
    const hashedPassword= await bcrypt.hash(password, salt);

    if (!email || !isEmail.validate(email)) return null;

    // The only field I need to store in db is accessToken as I have inside all user info
    const user = { email, password: hashedPassword };
    const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    
    const queryResult = await this.store.User.findOrCreate({ 
      where: { email },
      defaults: {
        accessToken,
      }
     });
     const { dataValues: newUser, _options: options } = queryResult && queryResult[0];
     if (options.isNewRecord) {
       return newUser;
     }
     return {
       message: userMessages.register.exists,
     };
  }

  async loginUser ({ email: emailArg, password, } = {}) {
    const email = this.context && this.context.user ? this.context.user.email : emailArg;

    const queryResult = await this.store.User.findAll({ 
      where: { email },
     });
     if (queryResult) {
       const accessToken = queryResult[0].dataValues.accessToken;
       const user = jwt.decode(accessToken);
       return bcrypt.compare(password, user.password).then((same) => {
         return same ? 
          { accessToken }
           : 
          { message: userMessages.login.passwordError }
         })
     } else {
      return {
        message: userMessages.login.erroExists,
      }
     }
  }
}

export default UserAPI;
