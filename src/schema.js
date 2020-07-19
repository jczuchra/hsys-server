import { gql } from 'apollo-server';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const Date = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  },
});

const typeDefs = gql`
  scalar Date

  type User {
    id: ID
    createdAt: String
    updatedAt: String
    email: String
    message: String
  }

  type Query {
    # User
    me: User

    # DeviceCategory
    allDeviceCategories: AllDeviceCategories

    # Device
    getDevice(id: ID!): Device
    allDevicesByCategory(categoryId: ID!): AllDevices
    allDevices: AllDevices

    # Asset
    getAsset(id: ID!): Asset
    allAssets: AllAssets
  }

  type Mutation {
    # User
    login(email: String, password: String): UserMessage
    register(email: String, password: String): UserMessage
    contactEmail(
      name: String
      email: String
      phone: Int
      message: String
      token: String
    ): ContactMessage
    # DeviceCategory
    createDeviceCategory(name: String): StatusDeviceCategory
    deleteDeviceCategory(id: ID): StatusDeviceCategory

    # Device
    addDevice(
      name: String
      location: Int
      productionDate: String
      lastMaintenance: String
      categoryId: String
    ): StatusDevice

    editDevice(
      id: ID
      name: String
      location: Int
      productionDate: String
      lastMaintenance: String
      categoryId: String
    ): StatusDevice

    deleteDevice(id: ID!): StatusDevice

    # Asset
    addAsset(name: String, quantity: Int, description: String): StatusAsset

    editAsset(
      id: ID!
      name: String
      quantity: Int
      description: String
    ): StatusAsset

    deleteAsset(id: ID!): StatusAsset
  }

  type UserMessage {
    message: String
    status: Boolean
  }

  type AllDeviceCategories {
    allElements: [DeviceCategory]
    info: Status
    count: Int
  }

  type AllDevices {
    allElements: [Device]
    info: Status
    count: Int
  }

  type DeviceCategory {
    id: ID
    name: String!
    quantity: Int
    description: String
  }

  type AllAssets {
    count: Int
    allElements: [Asset]
    info: Status
  }

  type Asset {
    id: ID
    name: String
    quantity: Int
    description: String
  }

  type Device {
    id: ID
    name: String!
    location: String
    productionDate: Date
    lastMaintenance: Date
    categoryId: Int
  }

  type Status {
    message: String
    success: Boolean
    error: Int
  }

  type StatusAsset {
    message: String
    success: Boolean
    error: Int
    asset: Asset
  }

  type StatusDevice {
    message: String
    success: Boolean
    error: Int
    asset: Device
  }

  type StatusDeviceCategory {
    message: String
    success: Boolean
    error: Int
    asset: DeviceCategory
  }

  type ContactMessage {
    message: String
    errors: [String]
    success: Boolean
  }
`;

export default typeDefs;
