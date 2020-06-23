import { DataSource } from 'apollo-datasource';
import {
  createElement,
  getAllElements,
  deleteElement,
  editElement,
} from './util';
import {
  generateCreateMessages,
  generateDeleteMessages,
  generateEditMessages,
} from '../utils/messages';

const deviceMessages = {
  create: generateCreateMessages('device'),
  delete: generateDeleteMessages('device'),
  edit: generateEditMessages('device'),
};

class DeviceAPI extends DataSource {
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
  async addDevice(params = {}) {
    const addQuantity = async () => {
      const queryResult = await this.store.DeviceCategory.findOne({
        id: params.categoryId,
      });
      const { dataValues, _options: options } = queryResult;
      queryResult.quantity = queryResult.quantity + 1;
      queryResult.save();
    };

    return await createElement({
      model: this.store.Device,
      where: {
        name: params.name,
      },
      defaults: {
        ...params,
      },
      messages: deviceMessages.create,
      callback: addQuantity,
    });
  }

  async getAllDevicesByCategory({ categoryId }) {
    return await getAllElements({
      model: this.store.Device,
      where: {
        categoryId,
      },
      messages: deviceMessages,
    });
  }

  async getAllDevices() {
    return await getAllElements({
      model: this.store.Device,
      messages: deviceMessages,
    });
  }

  async deleteDevice({ id }) {
    return await deleteElement({
      model: this.store.Device,
      where: { id },
      messages: deviceMessages.delete,
    });
  }

  async editDevice(params) {
    return await editElement({
      model: this.store.Device,
      where: { id: params.id },
      messages: deviceMessages.edit,
      newValues: { ...params },
    });
  }
}

export default DeviceAPI;
