export class CreateGuestDto {
  newGuestInfo: {
    id?: string;
    PID?: string;
    name: string;
    note?: string;
    numberOfInvoice?: number;
    travelidNumber: string;
    address: string;
    city: string;
    country: string;
    dateOfArrival: string;
    dateOfDeparture: string;
    dateOfBirth: string;
  };
  oldGuestInfo: {
    id?: string;
    PID?: string;
    name: string;
    note?: string;
    numberOfInvoice?: number;
    travelidNumber: string;
    address: string;
    city: string;
    country: string;
    dateOfArrival: string;
    dateOfDeparture: string;
    dateOfBirth: string;
  };
}
