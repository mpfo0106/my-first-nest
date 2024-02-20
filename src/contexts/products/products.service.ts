import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../db/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  // create(createProductDto: CreateProductDto) {
  //   return 'This action adds a new product';
  // }

  async findAll() {
    const products = await this.prismaService.product.findMany();
    return products;
  }

  async findOne(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    return product;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
