import * as rp from 'request-promise';
import * as shell from 'shelljs';

import { AppConfig } from '../config/App.config';
import { IGithubRepoFilterProperties } from '../interface/Github.interface';

export class GithubService {
    public getRepos = async () => {
        const options = {
            uri: 'https://api.github.com/user/repos',
            headers: {
                'Authorization': 'token ' + AppConfig.PERSONAL_ACCESS_TOKEN,
                'User-Agent': 'nodejs'
            },
            body: {
                visibility: 'private'
            },
            json: true
        };
        const repos = await rp(options);

        const filterRepos: IGithubRepoFilterProperties[] = repos.map((repo: any )=> {
                                                            return {
                                                                name: repo.name,
                                                                private: repo.private,
                                                                html_url: repo.html_url,
                                                                clone_url: repo.clone_url
                                                            }
                                                        });
        return filterRepos;
    }

    public cloneRepos = async (repos: string[]) => {
        shell.cd(__dirname + '/../../git');

        repos.forEach( async (repo) => {
            const {stderr, code} = shell.exec(`git clone ${repo}`, { silent: true });
            console.log(code);
        });
        
    }
}
