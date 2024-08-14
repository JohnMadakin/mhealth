import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../../database/sequelize';
import { Authuser } from 'types/user.type';

class Authentication extends Model {
  public id!: number;
  public authType!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

Authentication.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'authentication',
  hooks: {
    beforeCreate: async (user: Authuser) => {
      if (user.password) {
        const saltRounds = 10; // Number of salt rounds for hashing
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    beforeUpdate: async (user: Authuser) => {
      if (user.password) {
        const saltRounds = 10; // Number of salt rounds for hashing
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
  }
});

export default Authentication;
