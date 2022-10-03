import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  matchRoles(requiredRole: string[], userRole: string) {
    return requiredRole.find((role: string) => role === userRole)
      ? true
      : false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const userId: string | { [key: string]: any } = jwt.decode(
      context.getArgByIndex(0).headers.authorization.replace('Bearer ', ''),
    );
    if (userId) {
      const user = await this.usersService.getById(userId['userId']);
      return this.matchRoles(roles, user.role);
    }
  }
}
