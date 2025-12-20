import { Sequelize, Dialect } from 'sequelize';
export declare const databaseConfig: {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
    define: {
        timestamps: boolean;
    };
    logging: boolean;
    retry: {
        max: number;
    };
};
export declare const sequelize: Sequelize;
//# sourceMappingURL=database.d.ts.map