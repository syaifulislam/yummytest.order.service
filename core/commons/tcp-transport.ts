import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { TCP_CHANNEL_PRODUCT_SERVICE } from '../commons/tcp-channel';
@Injectable()
export class TcpTransport {
  constructor(
    @Inject('PRODUCT_SERVICE') 
    private productClient: ClientProxy
  ){}

  async sendMessageProductService<T = any>(channel: TCP_CHANNEL_PRODUCT_SERVICE, data: any): Promise<T> {
    try {
      const sendData = this.productClient.send(channel, data)
      return await sendData.toPromise();
    } catch (error) {
      throw new RpcException('Communication error, please try again')
    }
  }
}