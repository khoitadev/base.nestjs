import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Language } from '~/interface';
import { CreateLanguageDto } from '~/dto';

@Injectable()
export class LanguageService {
  constructor(
    @Inject('LANGUAGE_MODEL')
    private languageModel: Model<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    return this.languageModel.create(createLanguageDto);
  }

  async findAll(): Promise<Language[]> {
    return this.languageModel.find().exec();
  }
}
