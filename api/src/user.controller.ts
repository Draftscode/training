import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) { }
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.appService.getUser(id);
  }

  @Get('')
  getUsers(
    @Query('field') field: keyof UserEntity,
    @Query('order') order: 'asc' | 'desc',
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('filter') filter: string,
  ) {
    const _filter = filter ? JSON.parse(filter) : {};
    return this.appService.getUsers({ field, order, offset, limit, filter: _filter });
  }

  @Post('')
  createUser(@Body() body: Partial<UserEntity>) {
    return this.appService.createUser(body);
  }

  @Patch('')
  patchUser(@Param('id') id: number, @Body() body: Partial<UserEntity>) {
    return this.appService.patchUser(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.appService.removeUser(id);
  }
}
