import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashSync } from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'User')) {
      throw new UnauthorizedException(
        'You do not have permission to create a user',
      );
    }

    return await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashSync(createUserDto.password, 10),
      },
    });
  }

  async findAll() {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'User')) {
      throw new UnauthorizedException(
        'You do not have permission to read users',
      );
    }

    return await this.prismaService.user.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').User],
      },
    });
  }

  async findOne(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'User')) {
      throw new UnauthorizedException(
        'You do not have permission to read users',
      );
    }

    return this.prismaService.user.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').User],
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'User')) {
      throw new UnauthorizedException(
        'You do not have permission to update users',
      );
    }

    return this.prismaService.user.update({
      where: {
        id,
        AND: [accessibleBy(ability, 'update').User],
      },
      data: {
        ...updateUserDto,
        ...(updateUserDto.password && {
          password: hashSync(updateUserDto.password, 10),
        }),
      },
    });
  }

  async remove(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('delete', 'User')) {
      throw new UnauthorizedException(
        'You do not have permission to delete users',
      );
    }

    return await this.prismaService.user.delete({
      where: {
        id,
        AND: [accessibleBy(ability, 'delete').User],
      },
    });
  }
}
