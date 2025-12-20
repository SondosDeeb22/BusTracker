"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const userHelper_1 = require("../helpers/userHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const helper = new userHelper_1.UserHelper();
class UsersService {
    // async add(req: Request, res: Response){
    //     await helper.add(req, res, RouteModel,
    //     req.body, {
    //     enumFields: [{ field: "status", enumObj: routeStatus }],
    //     successMessage: "Route created Successfully",
    //     });    
    // }
    async add(req, res) {
        // await helper.add(req, res, UserModel,
        // req.body, 
        // ['id', 'email'], {
        // enumFields: [{ field: "status", enumObj: userStatus },
        //     { field: "role", enumObj: role },
        //     { field: "gender", enumObj: gender },
        // ],
        // successMessage: "User was Added  Successfully",
        // }); 
        await helper.add(req, res, userModel_1.default, req.body, ['email'], // nonDuplicateFields
        {
            transform: async (data) => {
                const out = { ...data };
                // normalize email
                if (out.email)
                    out.email = out.email.toLowerCase().trim();
                // hash password if present
                if (out.hashedPassword) {
                    const saltRounds = 10;
                    out.hashedPassword = await bcrypt_1.default.hash(out.hashedPassword, saltRounds);
                }
                return out;
            },
            successMessage: 'User created successfully',
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=userService.js.map