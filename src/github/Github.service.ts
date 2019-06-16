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
                                                            const m_repo: IRepoFilterProperties = {
                                                                id: repo.id,
                                                                name: repo.name,
                                                                owner: {
                                                                    login: repo.owner.login,
                                                                    type: repo.owner.type
                                                                },
                                                                private: repo.private,
                                                                html_url: repo.html_url,
                                                                clone_url: repo.clone_url
                                                            };

                                                            return m_repo;
                                                        });

        const response: IRepoResponse = { repos: filterRepos, link: link, provider: 'github'};
        return response;
    }

    public createRepo = async (repo_name: string) => {
        let options = {
            uri: this.baseUrl,
            headers: {
                'Authorization': 'token ' + AppConfig.GITHUB_ACCESS_TOKEN,
                'User-Agent': 'nodejs'
            },
            resolveWithFullResponse: true,
            body: {
                name: repo_name,
                private: true
            },
            json: true
        };
        
        let { headers, body } = await rp(options);

        if (headers.status === 401 || headers.status === 403 || headers.status === 404) {
            throw new Error(body.message);
        }
        let count = 1;
        let status = headers.status;

        while (status === 422) {
            options.body.name = `${repo_name}-${count++}`;
            const { re_headers, re_body } = await rp(options);
            status = re_headers.status;
            body = re_body;
        }

        const new_repo: IRepoFilterProperties = {
                                                    id: body.id,
                                                    name: body.name,
                                                    owner: {
                                                        login: body.owner.login,
                                                        type: body.owner.type
                                                    },
                                                    private: body.private,
                                                    html_url: body.html_url,
                                                    clone_url: body.clone_url
                                                }

        return new_repo;
    }

}
