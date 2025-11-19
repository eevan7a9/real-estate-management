import { responseError, responseSuccess } from "../../../utils/schema/response.js";
import { contactFormProperties } from "./schema.js";

export const submitContactFormOpts = (handler)=>({
    schema:{
        body:{
            type:"object",
            required:["name", "email", "message"],
            properties:{
                name:{type:"string"},
                email:{type:"string"},
                message:{type:"string", minLength:10}
            }
        },
        response:{
            201:responseSuccess({
                data:{type:"object", properties:contactFormProperties}
            }),
            400:responseError(),
        },
    },
    handler: handler,
});