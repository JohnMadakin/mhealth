import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';

// Define attributes for the Activity model
export interface ActivityAttributes {
  id: number;
  name: string;
  canTrack: boolean;
  description?: string;
  trackWith?: string;
}

// Define options for the Activity model
interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id'> {}

class Activity extends Model<ActivityAttributes, ActivityCreationAttributes>
  implements ActivityAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public trackWith?: string;
  public canTrack!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Activity.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  canTrack: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,

  },
  trackWith: {
    type: DataTypes.STRING,
    allowNull: true,

  },
}, {
  sequelize,
  tableName: 'activities',
});


export default Activity;
