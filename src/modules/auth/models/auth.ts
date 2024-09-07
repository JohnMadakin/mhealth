import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../../database/sequelize';
// import { Authuser } from 'types/user.type';
import Session from './session';
import OtpCred from './otp';
import Patient from '../../patients/models/patients';

// Define attributes for the Auth model
export interface AuthAttributes {
  id: string;
  authType: string;
  email?: string;
  phone?: string;
  password?: string;
  isVerified?: boolean;
  pin?: string;
}

// Define options for the Disease model
interface AuthCreationAttributes extends Optional<AuthAttributes, 'id'> {}

class Authentication extends Model<AuthAttributes, AuthCreationAttributes> {
  declare id: string;
  declare authType: string;
  declare email: string;
  declare phone: string;
  declare password: string;
  declare pin: string;
  declare isVerified: boolean;
  declare OtpCredentials: OtpCred;
  declare Sessions: Session;

  static associate() {
    // Recommendation.belongsTo(disease, { foreignKey: 'diseaseId' });
    // Recommendation.belongsTo(activity, { foreignKey: 'activityId' });
  }
  
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.getDataValue('password') || '');
  }

  public async validatePin(pin: string): Promise<boolean> {
    return bcrypt.compare(pin, this.getDataValue('pin') || '');
  }
}

Authentication.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  authType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'authentication',
  paranoid: true,
  hooks: {
    beforeCreate: async (user: Authentication) => {
      const saltRounds = 10; // Number of salt rounds for hashing
      if (user.password) {
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
      if (user.pin) {
        user.pin = await bcrypt.hash(user.pin, saltRounds);
      }
    },
    beforeUpdate: async (user: Authentication) => {
      const saltRounds = 10; // Number of salt rounds for hashing
      if (user.password) {
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
      if (user.pin) {
        user.pin = await bcrypt.hash(user.pin, saltRounds);
      }
    },
  }
});

// Session.belongsTo(Authentication);
// OtpCred.belongsTo(Authentication);
Authentication.hasMany(Session, {
  foreignKey: 'authId'
});
Authentication.hasMany(OtpCred, {
  foreignKey: 'authId'
});
Authentication.hasOne(Patient, {
  foreignKey: 'authId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Patient.belongsTo(Authentication, {
  foreignKey: 'authId'
});

export default Authentication;
