import { Field, InputType, ArgsType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationArgs } from '../../../core/commons/paginator'

@ArgsType()
export class GetProductListOrderArgs extends PaginationArgs {
  @Field()
  @IsOptional()
  globalSearch: string;

  @Field()
  @IsOptional()
  orderType: string = 'asc'

  @Field()
  @IsOptional()
  orderBy: string = 'name'
}

@ArgsType()
export class GetListOrderArgs extends PaginationArgs {
  @Field()
  @IsOptional()
  orderType: string = 'asc'

  @Field()
  @IsOptional()
  orderBy: string = 'name'
}