import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../database/sequelize';
import disease from './disease';
import symptom from './symptoms';

class DiseaseSymptom extends Model {}

DiseaseSymptom.init(
  {
    diseaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: disease,
        key: 'id',
      },
      primaryKey: true,
    },
    symptomId: {
      type: DataTypes.INTEGER,
      references: {
        model: symptom,
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
disease.belongsToMany(symptom, { through: DiseaseSymptom, foreignKey: 'diseaseId' });
symptom.belongsToMany(disease, { through: DiseaseSymptom, foreignKey: 'symptomId' });

export default DiseaseSymptom;
