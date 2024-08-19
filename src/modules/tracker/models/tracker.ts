import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import patients from '../../patients/models/patients';
import activities from '../../activities/models/activities';


// Define attributes for the Tracker model
export interface TrackerAttributes {
  id: number;
  patientId: number;
  activityId: number;
  frequency?: string;
}

// Define options for the Tracker model
interface TrackerCreationAttributes extends Optional<TrackerAttributes, 'id'> {}

class Tracker extends Model<TrackerAttributes, TrackerCreationAttributes>
  implements TrackerAttributes {
  public id!: number;
  public patientId!: number;
  public activityId!: number;
  public frequency?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Tracker.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly', 'one_time_only', 'none'),
    allowNull: true,
    defaultValue: 'none',
  },
  patientId: {
    type: DataTypes.INTEGER,
    references: {
      model: patients,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  activityId: {
    type: DataTypes.INTEGER,
    references: {
      model: activities,
      key: 'id',
    },
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  tableName: 'tracker',
});


export default Tracker;
