import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateOrderRequest {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsNumber()
  qty: number;
}