export default (sequelize, DataTypes) => {
    const DeviceCategory = sequelize.define('device_category', {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
      }
    })
  
    DeviceCategory.associate = (models) => {
  
    }
  
    return DeviceCategory;
  };
  
  