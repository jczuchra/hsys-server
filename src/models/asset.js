export default (sequelize, DataTypes) => {
  const Asset = sequelize.define('asset', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  });

  Asset.associate = (models) => {};

  return Asset;
};
