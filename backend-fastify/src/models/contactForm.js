import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        trim : true,        
    },
    email:{
        type:String,
        required : true,
        lowercase : true,
        match:[/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
     message: {
        type: String,
        required: true,
        minlength: 10,
    },
}, { timestamps: true });

export default mongoose.model("ContactForm", contactFormSchema);