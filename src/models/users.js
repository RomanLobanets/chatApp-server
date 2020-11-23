import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "The username can only contain letters and numbers",
          },
          len: {
            args: [3, 25],
            msg: "The username should be from 3 to 25 symbols",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: { args: true, msg: "Invalid Email" },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: "passsword needs to be greater than 5 characters",
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.password = hashedPassword;
        },
      },
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: { name: "userId", field: "user_id" },
    });
    // N to M
    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: { name: "userId", field: "user_id" },
    });

    User.belongsToMany(models.Channel, {
      through: models.PCMember,
      foreignKey: { name: "userId", field: "user_id" },
    });
  };
  return User;
};
