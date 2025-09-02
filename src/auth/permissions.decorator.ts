import { SetMetadata } from '@nestjs/common';

export type PermissionAction = 'read' | 'save';

export type RequiredPermission = {
  domain: 'Users' | 'Documents';
  moduleName: string;
  action: PermissionAction;
};

export const PERMISSION_METADATA_KEY = 'required_permission';

export const RequirePermission = (
  domain: RequiredPermission['domain'],
  moduleName: string,
  action: PermissionAction,
) => SetMetadata(PERMISSION_METADATA_KEY, { domain, moduleName, action } satisfies RequiredPermission);


