import sequelize from './src/database/sequelize';

module.exports = async () => {
  try {
    await sequelize.drop();
    await sequelize.close();
  } catch (error) {
    // console.log('🍐', error);
  }
};