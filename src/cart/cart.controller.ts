import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { IRequestUser, User } from 'src/shared/decorators/auth-user.decorator';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(
    @Body() createCartDto: CreateCartDto,
    @User() user: IRequestUser,
  ) {
    const data = await this.cartService.create(createCartDto, user.id);
    return {
      message: 'Item added successfully',
      data,
    };
  }

  @Get()
  async findAll(
    @User() user: IRequestUser,
    @Query('page') currentPage: string,
    @Query('perPage') perPage: string,
  ) {
    const cartItems = await this.cartService.findAll(user.id, {
      product: { select: { id: true, name: true, base_price: true, images: true } },
    });
    return {
      message: 'User cart items fetched successfully!',
      data: cartItems,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.cartService.findOneBy({ id });

    if (!item) throw new NotFoundException('Cart Item not found');

    return {
      message: 'Cart Item found',
      data: item,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const updatedCart = await this.cartService.update({ id }, updateCartDto);

    if (!updatedCart) throw new NotFoundException('Cart Item not found!');

    return {
      message: 'Cart Updated Successfully!',
      data: updatedCart,
    };
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    const deletedItem = await this.cartService.delete(id);
    return {
      message: 'Cart Item Deleted',
      data: deletedItem,
    };
  }
}
