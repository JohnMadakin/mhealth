import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';
// import Symptom from './symptoms';
// import TrackingDataSymptom from './disease.symptom';


// Define attributes for the TrackingData model
export interface TrackingDataAttributes {
  id: number;
  trackingItem: string;
}

// Define options for the TrackingData model
interface TrackingDataCreationAttributes extends Optional<TrackingDataAttributes, 'id'> {}

class TrackingData extends Model<TrackingDataAttributes, TrackingDataCreationAttributes>
  implements TrackingDataAttributes {
  declare id: number;
  declare trackingItem: string;
}

TrackingData.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  trackingItem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'trackingData',
  paranoid: true,
  timestamps: true,
});

// // Define Many-to-Many relationships
// TrackingData.belongsToMany(Symptom, { through: 'TrackingDataSymptom', foreignKey: 'diseaseId' });
// Symptom.belongsToMany(TrackingData, { through: 'TrackingDataSymptom', foreignKey: 'symptomId' });

export default TrackingData;
