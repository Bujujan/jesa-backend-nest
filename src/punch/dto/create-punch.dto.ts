export class CreatePunchDto {
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  category: 'A' | 'B' | 'C' | 'D';
  system_id?: string;
}