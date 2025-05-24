import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';
import { CaslAbilityService } from 'src/casl/casl-ability.service';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async create(createPostDto: CreatePostDto & { authorId: string }) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'Post')) {
      throw new UnauthorizedException('You are not allowed to create a post');
    }

    return await this.prismaService.post.create({
      data: createPostDto,
    });
  }

  async findAll() {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'Post')) {
      throw new UnauthorizedException('You are not allowed to read posts');
    }

    return this.prismaService.post.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').Post],
      },
    });
  }

  async findOne(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'Post')) {
      throw new UnauthorizedException('You are not allowed to read a post');
    }

    return await this.prismaService.post.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').Post],
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('update', 'Post')) {
      throw new UnauthorizedException('You are not allowed to update a post');
    }

    const post = await this.prismaService.post.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'update').Post],
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.prismaService.post.update({
      where: {
        id,
        AND: [accessibleBy(ability, 'update').Post],
      },
      data: {
        ...updatePostDto,
      },
    });
  }

  async remove(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('delete', 'Post')) {
      throw new UnauthorizedException('You are not allowed to delete a post');
    }

    return await this.prismaService.post.delete({
      where: {
        id,
        AND: [accessibleBy(ability, 'delete').Post],
      },
    });
  }
}
