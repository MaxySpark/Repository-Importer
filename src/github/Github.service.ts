import * as rp from 'request-promise';
import * as parse from 'parse-link-header';

import { AppConfig } from '../config/App.config';
import { IPagination, IRepoFilterProperties, IRepoResponse } from '../interface';

export class GithubService {
    
    private baseUrl = 'https://api.github.com/user/repos';

    public getRepos = async (url: string = this.baseUrl) => {
        const options = {
            uri: url,
            headers: {
                'Authorization': 'token ' + AppConfig.GITHUB_ACCESS_TOKEN,
                'User-Agent': 'nodejs'
            },
            resolveWithFullResponse: true,
            body: {
                visibility: 'private'
            },
            json: true
        };
        
        const { headers, body } = await rp(options);
        
        if (headers.status === 401 || headers.status === 403 || headers.status === 404) {
            throw new Error(body.message);
        }
        
        const link: IPagination = parse(headers.link);

        const filterRepos: IRepoFilterProperties[] = body.map((repo: any )=> {
                                                            return {
                                                                name: repo.name,
                                                                owner: {
                                                                    login: repo.owner.login,
                                                                    type: repo.owner.type
                                                                },
                                                                private: repo.private,
                                                                html_url: repo.html_url,
                                                                clone_url: repo.clone_url
                                                            }
                                                        });

        const response: IRepoResponse = { repos: filterRepos, link: link, provider: 'github'};
        return response;
    }

}
