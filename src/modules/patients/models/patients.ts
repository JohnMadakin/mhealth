import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import Authentication from '../../auth/models/auth';


// Define attributes for the session model
export interface PatientAttributes {
  id: number;
  authId: string;
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
  public authId!: string;
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
    type: DataTypes.UUID,
    references: {
      model: Authentication,
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
  tableName: 'patients',
  paranoid: true,
});

export default Patient;
