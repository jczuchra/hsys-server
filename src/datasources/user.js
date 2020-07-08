import { DataSource } from 'apollo-datasource';
import bcrypt from 'bcrypt';
import isEmail from 'isemail';
import { createTokens } from '../utils/tokens';
import messages from '../utils/messages';

const userMessages = messages['server.src.datasources.user'];

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
  async registerUser({ email: emailArg, password } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!email || !isEmail.validate(email)) return null;

    const queryResult = await this.store.User.findOrCreate({
      where: { email },
      defaults: {
        password: hashedPassword,
      },
    });
    const { dataValues: newUser, _options: options } =
      queryResult && queryResult[0];

    if (options.isNewRecord) {
      return {
        status: true,
        message: userMessages.register.success,
      };
    }
    return {
      status: false,
      message: userMessages.register.exists,
    };
  }

  async loginUser({ email: emailArg, password } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;

    const user = await this.store.User.findOne({
      where: { email },
    });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return { message: userMessages.login.passwordError };
      }

      const { accessToken, refreshToken } = createTokens(user);
      this.context.res.cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });
      this.context.res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });
      return {
        status: true,
        message: userMessages.login.success,
      };
    } else {
      return {
        status: false,
        message: userMessages.login.errorExists,
      };
    }
  }
}

export default UserAPI;
