export class CreatePunchDto {
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  system_id?: string;
}