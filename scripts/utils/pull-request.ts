import {RestEndpointMethodTypes} from '@octokit/rest';
import {ghClient, canvasTokensRepoParams} from './api-client';

/**
 *
 * A thin wrapper around GitHub's Octokit API.
 * [View Octokit Docs](https://octokit.github.io/rest.js/v18#pulls-create)
 *
 * Provide pull request params, and this function will create or pull request.
 * If a pull request already exists, this function will error.
 *
 */
export async function createPullRequest(
  params: RestEndpointMethodTypes['pulls']['create']['parameters']
) {
  try {
    const fullRepo = `${params.owner}/${params.repo}`;
    console.log(`Creating a PR to merge ${params.head} to ${params.base} for ${fullRepo}.\n`);
    await ghClient.pulls.create(params);
    console.log('✅ Success!\n');
  } catch (error: any) {
    console.error(`⛔️ Error: Failed to create a pull request.`, error.message);
  }
}

export async function createSyncPullRequest() {
  await createPullRequest({
    owner: canvasTokensRepoParams.owner,
    repo: canvasTokensRepoParams.repo,
    base: canvasTokensRepoParams.defaultBranch,
    head: canvasTokensRepoParams.syncBranch,
    maintainer_can_modify: true,
    title: 'chore: Sync Tokens Studio config 🤖',
  });
}
