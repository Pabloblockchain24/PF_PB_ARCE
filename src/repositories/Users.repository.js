import userDTO from "../dao/DTOs/user.dto.js";
import jwt from "jsonwebtoken"


export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUserByEmail = async (email) => {
        try {
            let user = await this.dao.getByEmail(email)
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getById = async (uid) => {
        try {
            let user = await this.dao.getUser(uid)
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserByCartId = async (cid) => {
        try {
            let result = await this.dao.getByCart(cid)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createUser = async (user) => {
        let newUser = new userDTO(user)
        let result = await this.dao.createUser(newUser)
        return result
    }

    updateUserById = async (uid, userToReplace) => {
        try {
            let result = await this.dao.updateUser(uid, userToReplace)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserByResetToken = async (token) => {
        try {
            let result = await this.dao.getUserByResetToken(token)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getAllUsers = async () => {
        try {
            let result = await this.dao.getAllUsers()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteUser = async (id) => {
        try {
            let result = await this.dao.deleteUser(id)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserByToken = async (token) => {
        try {
            const user = await new Promise((res, rej) => {
                jwt.verify(token, "CODER_TOKEN", async (err, user) => {
                    if (err) {
                        rej(err);
                    } else {
                        const result = await this.dao.getUser(user.id);
                        res(result);
                    }
                });
            });
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}