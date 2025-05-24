import { AbilityBuilder, PureAbility } from '@casl/ability';
import { User, Post, Roles } from '@prisma/client';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';

export type PermissionActions =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete';

export type PermissionResources = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<
  [PermissionActions, PermissionResources],
  PrismaQuery
>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
  ADMIN(user, { can }) {
    can('manage', 'all');
  },
  WRITER(user, { can }) {
    can('read', 'Post');
    can('create', 'Post');
    can('update', 'Post', { authorId: user.id });
  },
  READER(user, { can }) {
    can('read', 'Post', { published: true });
  },
  EDITOR(user, { can }) {
    can('read', 'Post');
    can('create', 'Post');
    can('update', 'Post', { authorId: user.id });
  },
};

@Injectable({
  scope: Scope.REQUEST,
})
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    rolePermissionsMap[user.role](user, builder);

    this.ability = builder.build();

    return this.ability;
  }
}
