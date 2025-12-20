import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { userAttributes } from '../interfaces/userInterface';
import { role, gender, status } from '../enums/userEnum';
declare class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> implements userAttributes {
    id: number;
    name: string;
    role: keyof typeof role;
    birthDate: Date;
    gender: keyof typeof gender;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseExpiryDate: Date;
    status: keyof typeof status;
    hashedPassword: string;
}
export default UserModel;
//# sourceMappingURL=userModel%20copy.d.ts.map