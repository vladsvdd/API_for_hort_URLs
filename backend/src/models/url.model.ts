import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'url_shortener',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    logging: false,
});

interface UrlAttributes {
    id: string;
    originalUrl: string;
    shortUrl: string;
    alias?: string;
    expiresAt?: Date;
    createdAt: Date;
    clickCount: number;
}

interface UrlCreationAttributes extends Optional<UrlAttributes, 'id' | 'createdAt' | 'clickCount'> {}

class Url extends Model<UrlAttributes, UrlCreationAttributes> implements UrlAttributes {
    public id!: string;
    public originalUrl!: string;
    public shortUrl!: string;
    public alias?: string;
    public expiresAt?: Date;
    public createdAt!: Date;
    public clickCount!: number;
}

Url.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    originalUrl: {
        type: DataTypes.STRING(2048),
        allowNull: false,
    },
    shortUrl: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    alias: {
        type: DataTypes.STRING(20),
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'urls',
});

export { sequelize, Url };