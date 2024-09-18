import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
import TrackingData from '../../diseases/models/tracking.data';
import Patient from '../../patients/models/patients';
import { Frequency } from 'types';

// Define attributes for the Reminder model
export interface ReminderAttributes {
  id: number;
  trackingDataId: number;
  patientId: string;
  name: string;
  description?: string;
  frequency?: Frequency;
  nextReminderAt?: Date;
  lastRemindedAt?: Date;
  reminderTime: string;
  isActive?: boolean;
  timezone: string;
}

// Define options for the Reminder model
interface ReminderCreationAttributes extends Optional<ReminderAttributes, 'id'> {}

class Reminder extends Model<ReminderAttributes, ReminderCreationAttributes>
  implements ReminderAttributes {
  declare id: number;
  declare name: string;
  declare patientId: string;
  declare description?: string;
  declare trackingDataId: number;
  declare frequency?: Frequency;
  declare nextReminderAt?: Date;
  declare lastRemindedAt?: Date;
  declare reminderTime: string;
  declare isActive?: boolean;
  declare timezone: string;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;
}

Reminder.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  trackingDataId: {
    type: DataTypes.INTEGER,
    references: {
      model: TrackingData,
      key: 'id',
    },
    allowNull: true,
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: Patient,
      key: 'id',
    },
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nextReminderAt: {
    type: DataTypes.DATE,
  },
  reminderTime: {
    type: DataTypes.TIME,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastRemindedAt: {
    type: DataTypes.DATE,
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
  },
}, {
  sequelize,
  tableName: 'reminders',
  paranoid: true,
});

// // Define Many-to-Many relationships
// Reminder.belongsToMany(Symptom, { through: 'ReminderSymptom', foreignKey: 'diseaseId' });
// Symptom.belongsToMany(Reminder, { through: 'ReminderSymptom', foreignKey: 'symptomId' });

export default Reminder;
