import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MonumentsService {
  constructor(private prisma: PrismaService) {}

  findAll(page: number, limit: number) {
  return this.prisma.monument.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: { photos: true },
    orderBy: { id: 'asc' }
  });
  }
  // Tworzy nowy pomnik z danymi i opcjonalnymi zdjęciami
  // Jeśli zdjęcia są podane, tworzy je w relacji z pomnikiem
  create(data: { 
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
    photos?: { url: string }[];
  }) {
    return this.prisma.monument.create({
      data: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        photos: data.photos ? {
          createMany: {
            data: data.photos.map(photo => ({ url: photo.url }))
          }
        } : undefined
      },
      include: { photos: true }
    });
  }

  // Aktualizuje istniejący pomnik na podstawie podanego ID i danych
  // Jeśli zdjęcia są podane, usuwa istniejące zdjęcia i tworzy nowe
  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      latitude?: number;
      longitude?: number;
      photos?: { url: string }[];
    }
  ) {
    const updatedMonument = await this.prisma.monument.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      include: { photos: true }
    });

    if (data.photos) {
      await this.prisma.photo.deleteMany({
        where: { monumentId: id }
      });

      await this.prisma.photo.createMany({
        data: data.photos.map(photo => ({
          url: photo.url,
          monumentId: id
        }))
      });

      return this.prisma.monument.findUnique({
        where: { id },
        include: { photos: true }
      });
    }

    return updatedMonument;
  }

  // Usuwa pomnik na podstawie podanego ID
  // Najpierw usuwa wszystkie zdjęcia związane z tym pomnikiem,
  async remove(id: number) {
    await this.prisma.photo.deleteMany({
      where: { monumentId: id }
    });

    return this.prisma.monument.delete({
      where: { id }
    });
  }
}
