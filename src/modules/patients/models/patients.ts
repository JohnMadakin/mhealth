import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';

export class Patient extends Model {
  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public dob!: string;
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
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'patient'
});

export default Patient;
