export default (sequelize, DataTypes) => {
  const Team = sequelize.define("team", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [5, 100],
          msg: "name needs to be greater than 5 characters",
        },
      },
    },
  });
  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: { name: "teamId", field: "team_id" },
    });
  };
  return Team;
};
