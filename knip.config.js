/** @type {import('knip').KnipConfig} */
const config = {
  project: ['src/**/*.ts', 'tests/**/*.ts'],
  ignoreDependencies: ['tsx', '@semantic-release/commit-analyzer', '@semantic-release/github', '@semantic-release/npm', '@semantic-release/release-notes-generator', 'conventional-changelog-conventionalcommits'],
};

export default config;
