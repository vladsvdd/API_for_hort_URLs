import { Model, DataTypes } from 'sequelize';
import { sequelize, Url } from './url.model';

class Analytics extends Model {
    public id!: string;
    public urlId!: string;
    public ipAddress!: string;
    public accessedAt!: Date;
}

Analytics.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    urlId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Url,
            key: 'id',
        },
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    accessedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'analytics',
});

Url.hasMany(Analytics, { foreignKey: 'urlId' });
Analytics.belongsTo(Url, { foreignKey: 'urlId' });

export { Analytics };