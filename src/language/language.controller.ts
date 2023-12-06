import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateLanguageDto } from '~/dto';
import { LanguageService } from '~/language/language.service';
import { Language } from '~/interface';
import { Public } from '~/auth/decorators/public.decorator';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Public()
  @Get('list')
  async findAll(): Promise<Language[]> {
    return this.languageService.findAll();
  }

  @Public()
  @Post('create')
  async create(
    @Body() createLanguageDto: CreateLanguageDto,
  ): Promise<Language> {
    return this.languageService.create(createLanguageDto);
  }
}
