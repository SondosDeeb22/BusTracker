import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { userAttributes } from '../interfaces/userInterface';
import { role, gender, status, language, appearance } from '../enums/userEnum';
declare class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> implements userAttributes {
    id: string;
    name: string;
    role: keyof typeof role;
    birthDate: string;
    gender: keyof typeof gender;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseExpiryDate: string;
    status: keyof typeof status;
    hashedPassword: string;
    language: keyof typeof language;
    appearance: keyof typeof appearance;
}
export default UserModel;
//# sourceMappingURL=userModel.d.ts.map