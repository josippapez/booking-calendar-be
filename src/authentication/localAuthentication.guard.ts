import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'auth.EMAIL_NOT_VALID' }),
  password: z.string().min(6, { message: 'auth.PASSWORD_TOO_SHORT' }),
});

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {
  handleRequest(err, user, info, context, status) {
    try {
      const request = context.switchToHttp().getRequest();
      const { email, password } = request.body;
      loginSchema.parse({ email, password: password });
      if (!user) {
        throw new HttpException('auth.DOES_NOT_EXIST', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (error: z.ZodError | HttpException | any) {
      if (error instanceof z.ZodError) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
}
