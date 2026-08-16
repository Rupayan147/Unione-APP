'use strict';

const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.startsWith('pnpm/')) {
  console.error('This workspace uses pnpm. Run "corepack enable" and then "pnpm install" from the repository root.');
  process.exit(1);
}
