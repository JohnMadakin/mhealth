import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Authentication from './auth';

// Define attributes for the session model
export interface SessionAttributes {
  id: string;
  authId: number;
}

class Session extends Model {
  declare id: string;
  declare authId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

}

Session.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  authId: {
    type: DataTypes.UUID,
    references: {
      model: Authentication,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'sessions',
  paranoid: true,
});

export default Session;
