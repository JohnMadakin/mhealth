import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import authentication from '../../auth/models/auth';


// Define attributes for the session model
export interface PatientAttributes {
  id: number;
  authId: number;
  firstname: string;
  lastname: string;
  dob: string;
  sex: string;
}

// Define options for the Disease model
interface PatientCreationAttributes extends Optional<PatientAttributes, 'id'> {}

export class Patient extends Model<PatientAttributes, PatientCreationAttributes>
  implements PatientAttributes {
  public id!: number;
  public authId!: number;
  public firstname!: string;
  public lastname!: string;
  public dob!: string;
  public sex!: string;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
}

Patient.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authId: {
    type: DataTypes.INTEGER,
    references: {
      model: authentication,
      key: 'id',
    },
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'patients'
});

Patient.hasOne(authentication, {
  foreignKey: 'authId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
export default Patient;
