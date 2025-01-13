import { Role, ROLES_KEY } from '@app/common/constants';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles)
};