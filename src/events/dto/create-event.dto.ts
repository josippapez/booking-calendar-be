export class CreateEventDto {
  id?: string;
  name: string;
  start: string;
  end: string;
  description?: string;
  color?: string;
  phone: string;
  booking?: boolean;
  price?: string;
  weekNumber?: number;
}
