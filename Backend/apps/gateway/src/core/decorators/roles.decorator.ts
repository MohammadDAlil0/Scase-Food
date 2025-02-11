import { Role, ROLES_KEY } from '@app/common/constants';
import { SetMetadata } from '@nestjs/common';

/**
 * 
 * @param ...Role
 * @description Set which role can get access to this api.
 */
export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles)
};