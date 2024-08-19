import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Authentication from './auth';

// Define attributes for the session model
export interface SessionAttributes {
  id: number;
  authId: number;
  hash?: string;
}

class Session extends Model {
  public id!: number;
  public authId!: number;
  public hash!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authId: {
    type: DataTypes.INTEGER,
    references: {
      model: Authentication,
      key: 'id',
    },
    allowNull: false,
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'sessions',
});

Session.belongsTo(Authentication);
export default Session;
