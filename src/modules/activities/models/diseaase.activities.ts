import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../database/sequelize';
import disease from '../../diseases/models/disease';
import activity from './activities';

class DiseaseActivity extends Model {}

DiseaseActivity.init(
  {
    diseaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: disease,
        key: 'id',
      },
      primaryKey: true,
    },
    activityId: {
      type: DataTypes.INTEGER,
      references: {
        model: activity,
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'diseaseActivities',
  }
);

// Define Many-to-Many relationships
disease.belongsToMany(activity, { through: DiseaseActivity, foreignKey: 'diseaseId' });
activity.belongsToMany(disease, { through: DiseaseActivity, foreignKey: 'activityId' });

export default DiseaseActivity;
