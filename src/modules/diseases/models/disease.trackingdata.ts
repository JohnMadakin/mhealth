import { BelongsToMany, DataTypes, Model } from 'sequelize';
import sequelize from '../../../database/sequelize';
import disease from './disease';
import symptom from './symptoms';
import Patient from '../../patients/models/patients';
import TrackingData from './tracking.data';

class DiseaseTrackingData extends Model {
  declare id: string;
  declare diseaseId: number;
  declare symptomId: number;
  
  static Patient: BelongsToMany<DiseaseTrackingData, Patient>;
  static associate() {
    DiseaseTrackingData.belongsTo(disease, { foreignKey: 'diseaseId' });
    DiseaseTrackingData.belongsTo(TrackingData, { foreignKey: 'symptomId' });
  }
}


DiseaseTrackingData.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    diseaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: disease,
        key: 'id',
      },
      primaryKey: true,
    },
    trackingDataId: {
      type: DataTypes.INTEGER,
      references: {
        model: TrackingData,
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'diseaseTrackingData',
    paranoid: true,
  }
);

// Define Many-to-Many relationships
disease.belongsToMany(TrackingData, { through: 'diseaseTrackingData', foreignKey: 'diseaseId' });
TrackingData.belongsToMany(disease, { through: 'diseaseTrackingData', foreignKey: 'trackingDataId' });
// for completeness
DiseaseTrackingData.belongsTo(disease, { foreignKey: 'diseaseId' });
DiseaseTrackingData.belongsTo(TrackingData, { foreignKey: 'trackingDataId' });

export default DiseaseTrackingData;
