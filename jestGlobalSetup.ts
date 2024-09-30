import sequelize from './src/database/sequelize';

module.exports = async () => {
  // await sequelize.authenticate();
  // await sequelize.drop();
  await sequelize.sync({ force: true });
}