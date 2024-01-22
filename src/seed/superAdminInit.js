import { connectDB } from "../db/index.js";
import User from "../db/models/user.js";
import { USER_TYPE } from "../utils/constants.js";
import bcrypt from "bcrypt";

const super_admin = {
    full_name: "Tirath Sharma",
    username: "tirathsharma098",
    password: "Test@1234",
    email: "tirathsharma098@gmail.com",
    mobile: "8989787678",
    user_type: USER_TYPE.SUPER_ADMIN,
};

connectDB()
.then(async()=>{
    const encryptedPassword = await bcrypt.hash(super_admin.password, 12);
    const newUser = new User({...super_admin, password: encryptedPassword});
    const result = await newUser.save();
    console.log(">>> SUPER USER ADDED SUCCESSFULLY >> ", result);
})
.catch(err => console.log(">>> DB ERROR : ", err));