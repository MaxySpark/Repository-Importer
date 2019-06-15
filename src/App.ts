import * as prompts from 'prompts';
import * as ora from 'ora';

import { GithubService } from './github/Github.service';
import { IGithubRepoFilterProperties, IPagination, IGithubRepoResponse } from './interface/Github.interface';

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
        const spinner = ora({
            text: 'Fetching Repositories\n',
        }).start();

        try {

            let githubResponse : IGithubRepoResponse;
    
            if (provider === 'github') {
                githubResponse = await this.githubService.getRepos();
            }
    
            spinner.text = 'Repositories Fetched Successfully\n';
            spinner.succeed();
    
            return githubResponse;

        } catch(e) {
            
            spinner.stop();
            throw new Error(e);
        }
        
    };

    public selectRepos = async (repos: IGithubRepoFilterProperties[]) => {
        const selectedRepos = await prompts({
            type: 'autocompleteMultiselect',
            name: 'value',
            message: 'Pick Repos',
            choices: repos.map(repo => { return { title: `${repo.owner.login} : ${repo.name}${repo.private ? ' (Private)' : ''}`, value: repo.clone_url }; }),
            hint: '- Space to select. Return to submit'
        });

        return selectedRepos.value;
    }

    public fetchMoreRepos = async (provider: 'github' | 'bitbucket', data: IGithubRepoResponse) => {
        const link = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a Link To Fetch More Repositories',
            choices: Object.keys(data.link).map((key: 'prev' | 'next' | 'last') => {
                return {
                    title: `${key} page`,
                    value: data.link[key].url
                };
            }),
            initial: 0
        });

        const spinner = ora({
            text: 'Fetching Repositories\n',
        }).start();

        try {

            let githubResponse : IGithubRepoResponse;
    
            if (provider === 'github') {
                githubResponse = await this.githubService.getRepos(link.value);
            }
    
            spinner.text = 'Repositories Fetched Successfully\n';
            spinner.succeed();
    
            return githubResponse;

        } catch(e) {
            
            spinner.stop();
            throw new Error(e);
        }
    }

    public isRepeat = async () => {
        const repeat = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Want to fetch more Repositories?',
            initial: true
        });

        return repeat.value ? repeat.value : false;
    }

}