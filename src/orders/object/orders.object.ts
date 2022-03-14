import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationBaseObject } from '../../../core/commons/paginator';
@ObjectType()
export class GetListProductOrderData {
  @Field()
  id: String;

  @Field()
  name: String;

  @Field()
  sku: String;

  @Field()
  sales: Number;

  @Field()
  totalQty: Number;
}

@ObjectType()
export class GetListProductOrderResponse extends PaginationBaseObject {
  @Field(type => [GetListProductOrderData], { nullable: true })
  data: GetListProductOrderData[]
}

@ObjectType()
export class CreateOrderResponse {
  @Field()
  success: boolean
}

export class RetrieveProductResponse {
  name: string;
  sku: string;
  type: string;
}

@ObjectType()
export class GetOrderData {
  @Field()
  productName: String

  @Field()
  productSku: String

  @Field()
  productType: String

  @Field()
  qty: number
}

@ObjectType()
export class GetOrderResponse extends PaginationBaseObject {
  @Field(type => [GetOrderData], { nullable: true })
  data: GetOrderData[]
}