import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../../database/sequelize';
import { Authuser } from 'types/user.type';
import Patient from '../../patients/models/patients';
import Session from './session';

// Define attributes for the Auth model
export interface AuthAttributes {
  id: number;
  authType: string;
  email?: string;
  password?: string;
}

// Define options for the Disease model
interface AuthCreationAttributes extends Optional<AuthAttributes, 'id'> {}

class Authentication extends Model<AuthAttributes, AuthCreationAttributes>
implements AuthAttributes  {
  public id!: number;
  public authType!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

Authentication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'authentication',
  hooks: {
    beforeCreate: async (user: Authuser) => {
      if (user.password) {
        const saltRounds = 10; // Number of salt rounds for hashing
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    beforeUpdate: async (user: Authuser) => {
      if (user.password) {
        const saltRounds = 10; // Number of salt rounds for hashing
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
  }
});

Patient.belongsTo(Authentication);
Authentication.hasMany(Session, {
  foreignKey: 'authId'
});

export default Authentication;
