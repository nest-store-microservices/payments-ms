import 'dotenv/config';
import * as joi from 'joi';


interface EnvsVars{
    PORT: number;
    STRIPE_SECRET_KEY: string;
}


const envsSchema = joi.object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
}).unknown(true);


const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVar:EnvsVars =  value;

export const envs ={
    port: envVar.PORT,
    stripeSecretKey: envVar.STRIPE_SECRET_KEY,
}
