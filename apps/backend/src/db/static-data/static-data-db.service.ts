import { Injectable } from '@nestjs/common';
import { StaticDataDBRepository } from '@db/static-data/static-data-db.repository';

@Injectable()
export class StaticDataDBService {
  constructor(private readonly staticDataRepository: StaticDataDBRepository) {}

  async getActiveCourses() {
    return this.staticDataRepository.getActiveCourses();
  }
}
