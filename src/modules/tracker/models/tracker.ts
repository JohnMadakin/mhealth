import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import patients from '../../patients/models/patients';
import activities from '../../activities/models/activities';


// Define attributes for the Tracker model
export interface TrackerAttributes {
  id: number;
  patientId: string;
  fitBitData?: any;
}

// Define options for the Tracker model
interface TrackerCreationAttributes extends Optional<TrackerAttributes, 'id'> {}

class Tracker extends Model<TrackerAttributes, TrackerCreationAttributes>
  implements TrackerAttributes {
    declare id: number;
    declare patientId: string;
    declare fitBitData: any;
}

Tracker.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: patients,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  fitBitData: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
}, {
  sequelize,
  tableName: 'tracker',
  timestamps: true,
  paranoid: true,
});


export default Tracker;
