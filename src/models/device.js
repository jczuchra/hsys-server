export default (sequelize, DataTypes) => {
  const Device = sequelize.define('device', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    location: {
      type: DataTypes.INTEGER,
    },
    productionDate: {
      type: DataTypes.DATE,
    },
    lastMaintenance: {
      type: DataTypes.DATE,
    },
  });

  Device.associate = (models) => {
    Device.belongsTo(models.DeviceCategory, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
      hooks: true,
    });
  };

  return Device;
};
