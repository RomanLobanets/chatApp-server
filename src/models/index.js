import Sequelize from "sequelize";

// const sequelize = new Sequelize("slack", "avnadmin", "jhek8h30m7lf24y7", {
//   dialect: "postgres",
// });
const sequelize = new Sequelize(
  "postgres://avnadmin:jhek8h30m7lf24y7@pg-1fee7ce6-lobanets-dd72.aivencloud.com:25014/slack?sslmode=require",
  {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    define: { undescored: true },
  }
);

const models = {
  User: sequelize.import("./users"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
  PCMember: sequelize.import("./pcmember"),
};
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.op = Sequelize.Op;

export default models;
