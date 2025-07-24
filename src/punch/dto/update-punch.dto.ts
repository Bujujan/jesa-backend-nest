export class UpdatePunchDto {
  title?: string;
  description?: string;
  status?: 'OPEN' | 'CLOSED';
  system_id?: string | null;
}