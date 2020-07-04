import SQL from 'sequelize';

const Op = SQL.Op;
const operatorsAliases = {
  $in: Op.in,
};

// const sequelize = new SQL('hsys', 'postgres', 'Zaq123edc', {
//     dialect: 'postgres',
//     underscored: true,
//     operatorsAliases,
//     protocol: 'postgres',
//     dialectOptions: {
//         ssl: true
//     }
// });

const sequelize = process.env.DATABASE_URL
  ? new SQL(process.env.DATABASE_URL, {
      dialect: 'postgres',
      underscored: true,
      operatorsAliases,
      protocol: 'postgres',
      dialectOptions: {
        ssl: true,
        rejectUnauthorized: false,
      },
    })
  : new SQL('hsys', 'postgres', 'Zaq123edc', {
      dialect: 'postgres',
      underscored: true,
      operatorsAliases,
      protocol: 'postgres',
    });

const models = {
  Asset: sequelize.import('./asset'),
  DeviceCategory: sequelize.import('./deviceCategory'),
  Device: sequelize.import('./device'),
  User: sequelize.import('./user'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.SQL = SQL;

export default models;
