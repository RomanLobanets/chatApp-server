import Sequelize from 'sequelize';

// const sequelize = new Sequelize("slack", "avnadmin", "jhek8h30m7lf24y7", {
//   dialect: "postgres",
// });
const sequelize = new Sequelize(
  'postgres://avnadmin:saizszmufvlzuvw0@pg-266e3494-extreme-cb0c.aivencloud.com:26522/defaultdb?sslmode=require',
  {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
      host: process.env.DB_HOST || 'localhost',
    },
    define: { undescored: true },
  }
);

const models = {
  User: sequelize.import('./users'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
  PCMember: sequelize.import('./pcmember'),
};
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.op = Sequelize.Op;

export default models;
