import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../database/sequelize';


// Define attributes for the Rule model
export interface RuleAttributes {
  id: number;
  rule: any;
}

// Define options for the Rule model
interface RuleCreationAttributes extends Optional<RuleAttributes, 'id'> {}

class Rule extends Model<RuleAttributes, RuleCreationAttributes>
  implements RuleAttributes {
  declare id: number;
  declare rule: any;

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;
}

Rule.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rule: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'rules',
  paranoid: true,
});


export default Rule;
