import * as prompts from 'prompts';
import { GithubService } from './github/Github.service';
import { IGithubRepoFilterProperties } from './interface/Github.interface';

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
        let repos: IGithubRepoFilterProperties[];
        if (provider === 'github') {
            repos = await this.githubService.getRepos();
        }
        return repos;
    };

        
}