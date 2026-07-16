import * as migration_20260716_133210 from './20260716_133210';
import * as migration_20260716_155018 from './20260716_155018';

export const migrations = [
  {
    up: migration_20260716_133210.up,
    down: migration_20260716_133210.down,
    name: '20260716_133210',
  },
  {
    up: migration_20260716_155018.up,
    down: migration_20260716_155018.down,
    name: '20260716_155018'
  },
];
