'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Password_Policy_Attr extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Password_Policy_Attr.belongsTo(models.Password_Policy, {
                foreignKey: 'policy_id',
                onUpdate: 'CASCADE',
            });
        }
    }
    Password_Policy_Attr.init(
        {
            policy_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Password_Policies',
                    key: 'id',
                },
            },
            attr_name: DataTypes.STRING,
            attr_value: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Password_Policy_Attr',
        }
    );
    return Password_Policy_Attr;
};
