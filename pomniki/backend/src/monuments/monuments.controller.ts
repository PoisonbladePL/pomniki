import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { MonumentsService } from './monuments.service';
import { CreateMonumentDto } from './dto/create-monument.dto';
import { UpdateMonumentDto } from './dto/update-monument.dto';

// Kontroler do zarządzania pomnikami
// Obsługuje żądania HTTP związane z pomnikami, takie jak pobieranie listy pomników i tworzenie nowych pomników
@Controller('monuments')
export class MonumentsController {
  constructor(private readonly monumentsService: MonumentsService) {}

  @Get()
  findAll() {
    return this.monumentsService.findAll();
  }

  @Post()
  create(@Body() data: CreateMonumentDto) {
    return this.monumentsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateMonumentDto) {
    return this.monumentsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monumentsService.remove(+id);
  }
}