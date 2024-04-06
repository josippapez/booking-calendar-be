import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async () => {
        const apartmentId =
          request.params.apartmentId ||
          request.body.apartmentId ||
          request.apartmentId;

        await fetch(`${process.env.FE_WEBHOOK_URL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apartmentId,
            timestamp: Date.now(),
          }),
        })
          .then((res) => {
            console.log('Webhook triggered', res.status);
          })
          .catch((err) => {
            console.error('Webhook failed', err);
          });
      }),
    );
  }
}
