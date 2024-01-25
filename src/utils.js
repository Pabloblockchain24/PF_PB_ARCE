import jwt from "jsonwebtoken"
import config from "./config/config.js"

export const createAccessToken = function(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

export const createResetToken = function(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: "1h" }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

// export const getUserByToken = async(req,res) => {
//     const { token } = req.cookies
//     if (!token) {
//         return res.json({ message: "NO EXISTE USUARIO AUTENTICADO" })
//     }
//     jwt.verify(token, "CODER_TOKEN", async (err, user) => {
//         if (err) return res.status(403).json({ message: "Token invalido" })
//         console.log(`Entre al getUserByToken`)
//         const userFound = await usersService.getById(user.id)
//         console.log(`Encontre el userFound`)
//         console.log(userFound)
//         return userFound
//     })
// }

