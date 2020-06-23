export default (sequelize, DataTypes) => {
  const DeviceCategory = sequelize.define('device_category', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  DeviceCategory.associate = (models) => {
    DeviceCategory.hasMany(models.Device, { onDelete: 'CASCADE', hooks: true });
  };

  return DeviceCategory;
};
