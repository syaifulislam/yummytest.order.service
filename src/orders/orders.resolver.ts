import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from '../../core/guard/roles.guard';
import { Roles, UsersRole } from 'core/decorator/roles.decorator';
import { PaginationInterceptor } from 'core/interceptor/pagination.interceptor';
import { GetProductListOrderArgs, GetListOrderArgs } from './dtos/orders.args';
import { CreateOrderRequest } from './dtos/orders.input';
import { GetListProductOrderResponse, CreateOrderResponse, GetOrderResponse } from './object/orders.object';
import { AuthTokenUser } from '../../core/guard/jwt.strategy';

@Resolver('Orders')
export class OrdersResolver {
  constructor(
    private readonly service: OrdersService
  ){}

  @Query(returns => GetListProductOrderResponse)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.CUSTOMER)
  @UseInterceptors(PaginationInterceptor)
  async getOrderProductList(@Args() query: GetProductListOrderArgs): Promise<GetListProductOrderResponse> {
    return await this.service.getProductList(query)
  }

  @Mutation(returns => CreateOrderResponse)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.CUSTOMER)
  async createOrder(@Args('input') body: CreateOrderRequest, @CurrentUser() user: AuthTokenUser): Promise<CreateOrderResponse> {
    console.log(user)
    await this.service.createOrder(body, user.id)
    return {
      success: true
    }
  }

  @Query(returns => GetOrderResponse)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.CUSTOMER)
  @UseInterceptors(PaginationInterceptor)
  async getOrderList(@Args() query: GetListOrderArgs): Promise<GetOrderResponse> {
    const {data,count} = await this.service.getListOrder(query)
    return {
      data,
      count,
      pageInfo: {
        currentPage: query.currentPage,
        pageSize: query.pageSize,
        totalPage: count % query.pageSize
      }
    }
  }
}
