import { DataTypes, Optional, Model } from 'sequelize';
import sequelize from '../../../database/sequelize';
import disease from '../../diseases/models/disease';
import activity from './activities';
import Symptom from '../../diseases/models/symptoms';

// Define attributes for the Tracker model
export interface RecommendationAttributes {
  id: number;
  diseaseId: number;
  symptomId: number;
  dataToTrack?: string;
}

interface RecommendationCreationAttributes extends Optional<RecommendationAttributes, 'id'> {}


class Recommendation extends Model<RecommendationAttributes, RecommendationCreationAttributes>
  implements RecommendationAttributes {
  declare id: number;
  declare diseaseId: number;
  declare symptomId: number;
  declare dataToTrack: string;

  static associate() {
    Recommendation.belongsTo(disease, { foreignKey: 'diseaseId' });
    Recommendation.belongsTo(activity, { foreignKey: 'activityId' });
  }

}

Recommendation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    symptomId: {
      type: DataTypes.INTEGER,
      references: {
        model: Symptom,
        key: 'id',
      },
      primaryKey: true,
    },
    dataToTrack: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'recommendations',
  }
);

// Define Many-to-Many relationships
disease.belongsToMany(activity, { through: Recommendation, foreignKey: 'diseaseId' });
activity.belongsToMany(disease, { through: Recommendation, foreignKey: 'activityId' });

Recommendation.belongsTo(disease, { foreignKey: 'diseaseId' });
Recommendation.belongsTo(activity, { foreignKey: 'activityId' });


export default Recommendation;
