export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    accessToken: {
      type: DataTypes.STRING(2048),
      unique: true,
    }
  })

  User.associate = (models) => {

  }

  return User;
};

