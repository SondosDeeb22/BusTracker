import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
declare class LoginAttemptModel extends Model<InferAttributes<LoginAttemptModel>, InferCreationAttributes<LoginAttemptModel>> {
    attemptID: CreationOptional<number>;
    userEmail: string;
    IPaddress: string;
    attemptLocation: string;
    attemptSuccessful: boolean;
    attemptTime: string;
    attemptDate: Date;
}
export default LoginAttemptModel;
//# sourceMappingURL=loginAttempModel.d.ts.map