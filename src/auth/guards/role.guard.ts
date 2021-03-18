import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this._reflector.get<string[]>('roles', context.getHandler())
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!this.hasRole(roles, user.role)) {
      throw new UnauthorizedException();
    }
    return true;
  }

  hasRole(rolesAllowed: string[], roleInToken: number): boolean {
    for (let i = 0; i < rolesAllowed.length; i++) {
      if (rolesAllowed[i] === roleInToken.toString()) {
        return true;
      }
    }
    return false;
  }
}
