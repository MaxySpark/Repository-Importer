import * as prompts from 'prompts';
import * as ora from 'ora';

import { GithubService } from './github/Github.service';
import { IGithubRepoFilterProperties, IPagination } from './interface/Github.interface';

export class App {
    private githubService = new GithubService();

    public selectProvider = async () => {
        const provider = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a Site To Get Repositories',
            choices: [
                { title: 'GitHub', value: 'github' },
                { title: 'BitBucket', value: 'bitbucket' }
            ],
            initial: 0
        });

        return provider.value;
    };

    public getRepos = async (provider: 'github' | 'bitbucket') => {
        let githubResponse : {
            repos: IGithubRepoFilterProperties[];
            link: IPagination;
        };

        const spinner = ora({
            text: 'Fetching Repositories\n',
        }).start();

        if (provider === 'github') {
            githubResponse = await this.githubService.getRepos();
        }

        spinner.text = 'Repositories Fetched Successfully\n';
        spinner.succeed();

        return githubResponse;
    };

    public selectRepos = async (repos: IGithubRepoFilterProperties[]) => {
        const selectedRepos = await prompts({
            type: 'multiselect',
            name: 'value',
            message: 'Pick Repos',
            choices: repos.map(repo => { return { title: repo.name, value: repo.clone_url }; }),
            hint: '- Space to select. Return to submit'
        });

        return selectedRepos.value;
    }

}