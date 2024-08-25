import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';
import { hashString } from '../../../utils/helpers'
import Authentication from './auth';

// Define attributes for the session model
export interface OtpCredentialAttributes {
  id: number;
  authId: string;
  otp?: string;
  failedCount?: number;
  expiry?: number;
}

class OtpCredential extends Model {
  declare id: number;
  declare authId: string;
  declare otp: string;
  declare expiry: number;
  declare failedCount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;

}

OtpCredential.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  failedCount: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
  },
  expiry: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'otpCred',
  hooks: {
    beforeCreate: async (otpData: OtpCredential) => {
      if (otpData.otp) {
        otpData.otp = hashString(otpData.otp);
      }
    },
    beforeUpdate: async (otpData: OtpCredential) => {
      if (otpData.otp) {
        otpData.otp = hashString(otpData.otp);
      }
    },
  },
  paranoid: true,
});

export default OtpCredential;
