import { DataSource } from 'apollo-datasource';
import { createElement, getAllElements, deleteElement } from './util';
import { generateCreateMessages, generateDeleteMessages } from '../utils/messages';

const assetMessages = {
    create: generateCreateMessages('asset'),
    delete: generateDeleteMessages('asset'),
}

class AssetAPI extends DataSource {
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
  async addAsset(params = {}) {
      return await createElement({
        model: this.store.Asset,
        where: {
            name: params.name,
        },
        defaults: {
            ...params,
        },
        messages: assetMessages.create,
      })
  }

  async getAllAssets() {
      return await getAllElements({
        model: this.store.Asset,
        messages: assetMessages,
      })
  }

  async deleteAsset({ id }) {
    return await deleteElement({
        model: this.store.Asset,
        where: { id },
        messages: assetMessages.delete,
    })
  }

}

export default AssetAPI;
