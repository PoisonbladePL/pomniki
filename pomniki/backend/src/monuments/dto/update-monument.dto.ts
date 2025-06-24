export class UpdateMonumentDto {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  photos?: { url: string }[];
}