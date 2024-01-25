import userModel from "../models/user.model.js"

export default class Users {
    constructor() {
    }

    getByEmail = async (email) => {
        try {
            let user = await userModel.findOne({ email: email })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUser = async (uid) => {
        try {
            let user = await userModel.findById(uid)
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getByCart = async (cid) => {
        try {
            let user = await userModel.findOne({ cart: cid })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createUser = async (user) => {
        let newUser = await userModel.create(user)
        return newUser
    }

    updateUser = async (uid, userToReplace) => {
        let actualizado = await userModel.updateOne({ _id: uid }, userToReplace)
        return actualizado
    }

    getUserByResetToken = async (token) => {
        try {
            let user = await userModel.findOne({ resetToken: token })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getAllUsers = async () => {
        try {
            let result = await userModel.find({})
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteUser = async (id) => {
        try {
            let result = await userModel.deleteOne({ _id: id });
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    

}

