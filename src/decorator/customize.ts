import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);

export const IS_PUBLIC_GUEST_KEY = 'isPublicGuest';
export const PublicGuest = () => SetMetadata(IS_PUBLIC_GUEST_KEY, true);