import contactForm from "../../models/contactForm.js";

export const submitContactForm = async(request, reply)=>{
    try{
        const{name, email, message} = request.body;

        if(!name || !email ||!message)
        {
            return reply.status(400).send({error:"All fields are required!"});
        }
        if(message.length<10)
        {
            return reply.status(400).send({ error: "Message must be at least 10 characters long!" });
        }

        const submssion = await contactForm.create({name, email, message});

        reply.status(201).send({
            success:true,
            message:"Message submitted successfully",
            data:submssion,
        });
    }
    catch(err)
    {
        reply.status(500).send({
            error:"Server error",
            details : err.message,
        });
    }
};