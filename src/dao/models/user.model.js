import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password:String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    }],
    role:{
        type: String,
        enum: ["user", "admin", "premium"],
        default: "user"
    },
    fotoPerfil: String,
    last_connection: Date,
    documentos: Array,
})

userSchema.plugin(mongoosePaginate)
const User = mongoose.model("user", userSchema)

export default User