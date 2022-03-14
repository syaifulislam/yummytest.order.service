import { Injectable } from '@nestjs/common';
import { TcpTransport } from '../../core/commons/tcp-transport';
import { TCP_CHANNEL_PRODUCT_SERVICE } from '../../core/commons/tcp-channel';
import { GetProductListOrderArgs, GetListOrderArgs } from './dtos/orders.args';
import { GetListProductOrderResponse, RetrieveProductResponse, GetOrderData, } from './object/orders.object';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from './schema/orders.schema';
import { CreateOrderRequest } from './dtos/orders.input';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Orders') 
    private readonly model: Model<Orders>,
    private readonly tcpTransport: TcpTransport
  ){}

  async getProductList(query: GetProductListOrderArgs): Promise<GetListProductOrderResponse> {
    const getProduct = await this.tcpTransport.sendMessageProductService<GetListProductOrderResponse>(TCP_CHANNEL_PRODUCT_SERVICE.GET_PRODUCT_LIST, query)
    await Promise.all(
      getProduct.data.map(async product => {
        product.totalQty = await this.getTotalQtyByProductId(product.id)
        product.sales = await this.getCountOrderByProductId(product.id)
      })
    )
    return getProduct
  }

  async getCountOrderByProductId(productId: String): Promise<number> {
    return await this.model.find({productId}).count()
  }

  async createOrder(body: CreateOrderRequest, userId: string): Promise<void> {
    const retrieveProduct = await this.retrieveProduct(body.productId);
    const bodyMerge = Object.assign({},body,{
      userId,
      productName: retrieveProduct.name,
      productSku: retrieveProduct.sku,
      productType: retrieveProduct.type
    })
    await new this.model({
      ...bodyMerge,
    }).save();
  }

  private async retrieveProduct(id: string): Promise<RetrieveProductResponse> {
    const retrieveProduct = await this.tcpTransport.sendMessageProductService<RetrieveProductResponse>(TCP_CHANNEL_PRODUCT_SERVICE.GET_PRODUCT_BY_ID, id)
    return retrieveProduct
  }

  async getTotalQtyByProductId(productId: String): Promise<number> {
    const getOrder = await this.model.find({productId})
    let total = 0;
    if (getOrder.length > 0) {
      getOrder.map(order => total += order.qty)
    }
    return total
  }

  async getListOrder(query: GetListOrderArgs): Promise<{data: GetOrderData[], count: number}> {
    const getOrders = await this.model.find(
      {},
      null,
      {
        skip: (query.pageSize * query.currentPage) - query.pageSize,
        limit: query.pageSize,
        sort:{[query.orderBy]: query.orderType}
      }
    );
    const count = await this.model.count();
    const data: GetOrderData[] = getOrders.map(order => {
      return {
        productName: order.productName,
        productSku: order.productSku,
        productType: order.productType,
        qty: order.qty,
      }
    })
    return {
      data,count
    }
  }
}
