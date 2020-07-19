import { contactEmail } from './utils/email';
import messages from './utils/messages';

const authMessages = messages['server.resolvers.auth'];

export default {
  Query: {
    me: async (_, __, { dataSources, req }) =>
      isLoggedIn(req) &&
      dataSources.UserAPI.findOne({ where: { id: req.userId } }),
    allDeviceCategories: async (_, __, { dataSources, req }) =>
      isLoggedIn(req) && dataSources.DeviceCategoryAPI.getAllDeviceCategories(),
    allDevicesByCategory: async (_, { categoryId }, { dataSources, req }) =>
      isLoggedIn(req) &&
      dataSources.DeviceAPI.getAllDevicesByCategory({ categoryId }),
    getDevice: async (_, { id }, { dataSources, req }) =>
      isLoggedIn(req) && dataSources.DeviceAPI.getDevice({ id }),
    allDevices: async (_, __, { dataSources, req }) =>
      isLoggedIn(req) && dataSources.DeviceAPI.getAllDevices(),
    allAssets: async (_, __, { dataSources, req }) =>
      isLoggedIn(req) && dataSources.AssetAPI.getAllAssets(),
    getAsset: async (_, { id }, { dataSources, req }) =>
      isLoggedIn(req) && dataSources.AssetAPI.getAsset({ id }),
  },
  Mutation: {
    // User
    login: async (_, { email, password }, { dataSources, req }) =>
      await dataSources.UserAPI.loginUser({ email, password }),
    register: async (_, { email, password }, { dataSources, req }) =>
      await dataSources.UserAPI.registerUser({ email, password }),
    contactEmail: async (_, { name, email, phone, message, token }) =>
      await contactEmail(name, email, phone, message, token),

    // Device Category
    createDeviceCategory: async (_, { name }, { dataSources, req }) =>
      isLoggedIn(req) &&
      (await dataSources.DeviceCategoryAPI.createDeviceCategory({ name })),
    deleteDeviceCategory: async (_, { id }, { dataSources, req }) =>
      isLoggedIn(req) &&
      (await dataSources.DeviceCategoryAPI.deleteDeviceCategory({ id })),

    // Device
    addDevice: async (_, params, { dataSources, req }) =>
      isLoggedIn(req) && (await dataSources.DeviceAPI.addDevice(params)),
    deleteDevice: async (_, { id }, { dataSources, req }) =>
      isLoggedIn(req) && (await dataSources.DeviceAPI.deleteDevice({ id })),
    editDevice: async (_, params, { dataSources, req }) =>
      isLoggedIn(req) && (await dataSources.DeviceAPI.editDevice(params)),

    // Asset
    // params here are name and quantity
    addAsset: async (_, params, { dataSources, req }) =>
      isLoggedIn(req) && (await dataSources.AssetAPI.addAsset(params)),
    deleteAsset: async (_, { id }, { dataSources, req }) =>
      isLoggedIn(req) && (await dataSources.AssetAPI.deleteAsset({ id })),
    editAsset: async (_, params, { dataSources, req }) =>
      isLoggedIn(req) && (await dataSources.AssetAPI.editAsset(params)),
  },
};

const isLoggedIn = (req) => req.userId;
