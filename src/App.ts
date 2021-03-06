import * as prompts from 'prompts';
import * as ora from 'ora';
import * as _ from 'lodash';

import { GithubService } from './github/Github.service';
import { BitbucketService } from './bitbucket/Bitbucket.service';
import { IRepoResponse, IRepoFilterProperties } from './interface';
import { SharedService } from './shared/Shared.service';

export class App {
    private githubService = new GithubService();
    private bitbucketService = new BitbucketService();
    private sharedService = new SharedService();
    
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

            let response : IRepoResponse;
    
            if (provider === 'github') {
                response = await this.githubService.getRepos();
            } else {
                response = await this.bitbucketService.getRepos();
            }
    
            spinner.text = 'Repositories Fetched Successfully\n';
            spinner.succeed();
    
            return response;

        } catch(e) {
            
            spinner.stop();
            throw new Error(e);
        }
        
    };

    public selectRepos = async (repos: IRepoFilterProperties[]) => {
        const selectedRepos = await prompts({
            type: 'autocompleteMultiselect',
            name: 'value',
            message: 'Pick Repos',
            choices: repos.map(repo => { return { title: `${repo.owner.login} : ${repo.name}${repo.private ? ' (Private)' : ''}`, value: repo.id.toString() }; }),
            hint: '- Space to select. Return to submit'
        });

        const keys = _.keyBy(selectedRepos.value);
        const filterRepo = _.filter(repos, (repo) => {
            return typeof keys[repo.id] !== 'undefined';
        })

        return filterRepo;
    }

    public fetchMoreRepos = async (provider: 'github' | 'bitbucket', data: IRepoResponse) => {
        const link = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a Link To Fetch More Repositories',
            choices: Object.keys(data.link).map((key: 'first' | 'prev' | 'next' | 'last') => {
                return {
                    title: `${key} page`,
                    value: data.link[key].url
                };
            }),
            initial: 0
        });

        if (!link.value) {
            return;
        }

        const spinner = ora({
            text: 'Fetching Repositories\n',
        }).start();

        try {

            let response : IRepoResponse;
    
            if (provider === 'github') {
                response = await this.githubService.getRepos(link.value);
            } else {
                response = await this.bitbucketService.getRepos(link.value);
            }
    
            spinner.text = 'Repositories Fetched Successfully\n';
            spinner.succeed();
    
            return response;

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

    public getPushRepoUrls = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {
        try {
            
            const repos_w_push_url: IRepoFilterProperties[] = [];
            const push_provider = this.getPushProvider(provider);
            
            const service = push_provider === 'github' ? 'Github' : 'Bitbucket';

            const spinner = ora({
                text: `Creating Repositories in ${service}\n`,
            }).start();

            if (push_provider === 'github') {
                for (const repo of repos) {
                    const n_repo = await this.githubService.createRepo(repo.name);
                    repo.push_url = n_repo.clone_url;
                    repos_w_push_url.push(repo);
                }
            } else {
                for (const repo of repos) {
                    const n_repo = await this.bitbucketService.createRepo(repo.name);
                    repo.push_url = n_repo.clone_url;
                    repos_w_push_url.push(repo);
                }
            }

            spinner.text = `Repositories Created Successfully in ${service}\n`;
            spinner.succeed();

            return repos_w_push_url;
        } catch(e) {
            console.log(e);
        }
        
    }

    public getPushProvider = (provider: 'github' | 'bitbucket') => {
        if (provider === 'github') {
            return 'bitbucket';
        } else {
            return 'github';
        }
    }

    public cloneRepos = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {
        await this.sharedService.cloneRepos(provider, repos);
    }

    public pushRepos = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {
        const push_provider = this.getPushProvider(provider);

        await this.sharedService.pushRepos(push_provider, repos);
    }

}