import { paginateResults } from './utils/db';

export default {
    Query: {
      me: async (_, __, { dataSources }) => dataSources.UserAPI.findOrCreateUser(),
      allDeviceCategories: async (_, __, { dataSources }) => dataSources.DeviceCategoryAPI.getAllDeviceCategories(),
      allDevices: async (_, { categoryId }, { dataSources }) => dataSources.DeviceAPI.getAllDevices({ categoryId }),
      allAssets: async(_, __, { dataSources }) => dataSources.AssetAPI.getAllAssets(),
    },
    Mutation: {
      // User
      login: async (_, { email, password }, { dataSources }) => {
        const user = await dataSources.UserAPI.loginUser({ email, password });
        if (user) return user.message || user.accessToken;
      },
      register: async(_, { email, password }, { dataSources }) => {
        const user = await dataSources.UserAPI.registerUser({ email, password });
        if (user) return user.message || user.accessToken;
      },

      // Device Category
      createDeviceCategory: async(_, { name }, { dataSources }) => (
        await dataSources.DeviceCategoryAPI.createDeviceCategory({ name })
      ),
      deleteDeviceCategory: async(_, { id }, { dataSources }) => (
        await dataSources.DeviceCategoryAPI.deleteDeviceCategory({ id })
      ),
      
      // Device
      addDevice: async(_, params, { dataSources }) => (
        await dataSources.DeviceAPI.addDevice(params)
      ),
      deleteDevice: async(_ , { id }, { dataSources }) => (
        await dataSources.DeviceAPI.deleteDevice({ id })
      ),

      // Asset
      // params here are name and quantity
      addAsset: async(_, params, { dataSources }) => (
        await dataSources.AssetAPI.addAsset(params)
      ),
      deleteAsset: async(_ , { id }, { dataSources }) => (
        await dataSources.AssetAPI.deleteAsset({ id })
      ),
    }
}