import * as prompts from 'prompts';
import * as ora from 'ora';
import * as _ from 'lodash';

import { GithubService } from './github/Github.service';
import { BitbucketService } from './bitbucket/Bitbucket.service';
import { IRepoResponse, IRepoFilterProperties, IUser } from './interface';
import { AppConfig } from './config/App.config';

export class App {
    private githubService = new GithubService();
    private bitbucketService = new BitbucketService();

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

}