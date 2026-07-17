import * as migration_20260716_133210 from './20260716_133210';
import * as migration_20260716_155018 from './20260716_155018';
import * as migration_20260716_164845 from './20260716_164845';
import * as migration_20260717_081059 from './20260717_081059';
import * as migration_20260717_132252_add_company_logo from './20260717_132252_add_company_logo';
import * as migration_20260717_145031 from './20260717_145031';

export const migrations = [
  {
    up: migration_20260716_133210.up,
    down: migration_20260716_133210.down,
    name: '20260716_133210',
  },
  {
    up: migration_20260716_155018.up,
    down: migration_20260716_155018.down,
    name: '20260716_155018',
  },
  {
    up: migration_20260716_164845.up,
    down: migration_20260716_164845.down,
    name: '20260716_164845',
  },
  {
    up: migration_20260717_081059.up,
    down: migration_20260717_081059.down,
    name: '20260717_081059',
  },
  {
    up: migration_20260717_132252_add_company_logo.up,
    down: migration_20260717_132252_add_company_logo.down,
    name: '20260717_132252_add_company_logo',
  },
  {
    up: migration_20260717_145031.up,
    down: migration_20260717_145031.down,
    name: '20260717_145031'
  },
];
