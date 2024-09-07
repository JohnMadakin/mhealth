import { BelongsToMany, DataTypes, Model } from 'sequelize';
import sequelize from '../../../database/sequelize';
import disease from './disease';
import symptom from './symptoms';
import Patient from '../../patients/models/patients';

class DiseaseSymptom extends Model {
  declare id: string;
  declare diseaseId: number;
  declare symptomId: number;
  
  // static Patient: BelongsToMany<DiseaseSymptom, Patient>;
  // static associate() {
  //   DiseaseSymptom.belongsTo(disease, { foreignKey: 'diseaseId' });
  //   DiseaseSymptom.belongsTo(symptom, { foreignKey: 'symptomId' });
  // }
}


DiseaseSymptom.init(
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
        model: 'disease',
        key: 'id',
      },
      primaryKey: true,
    },
    symptomId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'symptom',
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'diseaseSymptom',
    paranoid: true,
  }
);

// Define Many-to-Many relationships
disease.belongsToMany(symptom, { through: 'diseaseSymptom', foreignKey: 'diseaseId' });
symptom.belongsToMany(disease, { through: 'diseaseSymptom', foreignKey: 'symptomId' });
// for completeness
// DiseaseSymptom.belongsTo(disease, { foreignKey: 'diseaseId' });
// DiseaseSymptom.belongsTo(symptom, { foreignKey: 'symptomId' });

export default DiseaseSymptom;
