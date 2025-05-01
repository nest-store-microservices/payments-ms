import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";


export class PaymentSessionDto {


    @IsString()
    orderId: string; // order id from the database

    @IsString()    
    currency: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PaymentSessionItemsDto)
    items: PaymentSessionItemsDto[]


}

export class PaymentSessionItemsDto {

    @IsString()
    name:string;    

    @IsNumber()
    @IsPositive()
    price:number;


    @IsNumber()
    @IsPositive()
    quantity:number;
}