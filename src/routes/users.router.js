import { Router } from "express";
import multer from "multer";
import {login, register, logout, clearUsers, emailRequestResetPassword, sendMail, passwordRequestResetPassword, resetPassword, uploadDocuments,uploadProducts, uploadProfiles, changeStatus, getAllUsers, adminView, deleteUser, changeRolForAdmin} from "../controllers/user.controller.js"
import { storage } from "../controllers/user.controller.js";
import { adminAuth } from "../middlewares/validate.js";

const router = Router()

router.get("/", getAllUsers)
router.post("/login", login)
router.post("/register", register)
router.post("/logout", logout)
router.get("/premium/:uid", changeStatus)

// route para limpiar usuarios inactivos 2dias
router.delete("/clearUsersInactive", clearUsers) 

// route para eliminar un usuario desde el adminView
router.post("/delete/:uid", deleteUser )
router.post("/changeRolByAdmin/:uid", changeRolForAdmin)


// routes asociadas a la restauracion del password
router.get("/emailRequestResetPassword", emailRequestResetPassword)
router.post("/sendMailReset", sendMail)
router.get("/passwordRequestResetPassword/:tid", passwordRequestResetPassword)
router.post("/resetPassword/:tid", resetPassword)


// route para subir archivos
const upload = multer({storage})

router.post("/:uid/documents", upload.fields([{ name: 'identificacion'},{ name: 'comprobante_domicilio'},{ name: 'estado_cuenta'}]), uploadDocuments)
router.post("/:uid/profiles", upload.single('perfil'), uploadProfiles)
router.post("/:uid/products", upload.single('product'), uploadProducts )


// route para view admin
router.get("/adminView", adminAuth, adminView)

export default router