import { gql } from 'apollo-server';

const typeDefs = gql`

    type User {
        id: ID!
        createdAt: String!,
        updatedAt: String!,
        email: String!,
        token: String!,
    }

    type Query {
        # launches( # replace the current launches query with this one.
        #     """
        #     The number of results to show. Must be >= 1. Default = 20
        #     """
        #     pageSize: Int
        #     """
        #     If you add a cursor here, it will only return results _after_ this cursor
        #     """
        #     after: String
        # ): LaunchConnection!
        # launch(id: ID!): Launch
        # User
        me: User

        # DeviceCategory
        allDeviceCategories: AllDeviceCategories,

        # Device
        device(id: ID!): Device,
        allDevices(categoryId: ID!): AllDevices,

        # Asset
        allAssets: AllAssets,
    }

    """
    Simple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
        """

    type Mutation {
        # User
        login(email: String, password: String): String # login token
        register(email: String, password: String): String # login token

        # DeviceCategory
        createDeviceCategory(name: String): Status,
        deleteDeviceCategory(id: ID): Status,

        # Device
        addDevice(name: String, location: String, productionDate: String, lastMaintenance: String, categoryId: String): Status,
        editDevice(id: ID, name: String, location: String, productionDate: String, lastMaintenance: String, categoryId: String): Status,
        deleteDevice(id: ID): Status,

        # Asset
        addAsset(name: String, quantity: Int): Status,
        deleteAsset(id: ID): Status,
    }

    type AllDeviceCategories {
        allElements: [DeviceCategory],
        info: Status,
    }

    type AllDevices {
        allElements: [Device],
        info: Status,
    }

    type DeviceCategory {
        id: ID,
        name: String!,
        quantity: Int,
    }

    type AllAssets {
        allElements: [Asset],
        info: Status,
    }

    type Asset {
        id: ID,
        name: String,
        quantity: Int,
    }

    type Device {
        id: ID,
        name: String!,
        location: String,
        productionDate: String!,
        lastMaintenance: String!,
        categoryId: Int,
    }

    type Status {
        message: String,
        success: Boolean,
        error: Int,
    }

`;

export default typeDefs;