import { SeederModule } from '../../../lib/seeder.module.js';
import { CountrySeed } from '../../seeds/country.seed.js';
import { UserSeed } from '../../seeds/user.seed.js';

export const seederConfig = SeederModule.forRoot([UserSeed, CountrySeed]);
