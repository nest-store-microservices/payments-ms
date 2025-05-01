import 'dotenv/config';
import * as joi from 'joi';


interface EnvsVars{
    PORT: number;
    STRIPE_SECRET_KEY: string;
    URL_SUCCESS: string;
    URL_CANCELLED: string;
    END_POINT_SECRET: string;
}


const envsSchema = joi.object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    URL_SUCCESS: joi.string().uri().required(),
    URL_CANCELLED: joi.string().uri().required(),
    END_POINT_SECRET: joi.string().required(),
}).unknown(true);


const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVar:EnvsVars =  value;

export const envs ={
    port: envVar.PORT,
    stripeSecretKey: envVar.STRIPE_SECRET_KEY,
    frontendUrl: envVar.URL_SUCCESS,
    backendUrl: envVar.URL_CANCELLED,
    endPointSecret: envVar.END_POINT_SECRET,
}
