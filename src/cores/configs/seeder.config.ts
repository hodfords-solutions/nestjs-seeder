import { SeederModule } from '../../../lib/seeder.module';
import { CountrySeed } from '../../seeds/country.seed';
import { UserSeed } from '../../seeds/user.seed';

export const seederConfig = SeederModule.forRoot([UserSeed, CountrySeed]);
