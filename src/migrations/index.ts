import * as migration_20260716_133210 from './20260716_133210';

export const migrations = [
  {
    up: migration_20260716_133210.up,
    down: migration_20260716_133210.down,
    name: '20260716_133210'
  },
];
