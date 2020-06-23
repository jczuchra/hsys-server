import { DataSource } from 'apollo-datasource';
import { createElement, getAllElements, deleteElement } from './util';
import {
  generateCreateMessages,
  generateDeleteMessages,
} from '../utils/messages';

const deviceCategoryMessages = {
  create: generateCreateMessages('device category'),
  delete: generateDeleteMessages('device category'),
};

class DeviceCategoryAPI extends DataSource {
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
  async createDeviceCategory({ name } = {}) {
    return await createElement({
      model: this.store.DeviceCategory,
      where: {
        name: name.toUpperCase(),
      },
      messages: deviceCategoryMessages.create,
    });
  }

  async getAllDeviceCategories() {
    return await getAllElements({
      model: this.store.DeviceCategory,
      messages: deviceCategoryMessages,
    });
  }

  async deleteDeviceCategory({ id }) {
    return await deleteElement({
      model: this.store.DeviceCategory,
      where: { id },
      cascade: true,
      messages: deviceCategoryMessages.delete,
    });
  }
}

export default DeviceCategoryAPI;
