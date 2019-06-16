import * as rp from 'request-promise';

import { AppConfig } from '../config/App.config';
import { IPagination, IRepoFilterProperties, IRepoResponse } from '../interface';

export class BitbucketService {

    private baseUrl = 'https://api.bitbucket.org/2.0/repositories?role=member&pagelen=30';

    public getRepos = async (url: string = this.baseUrl) => {
        const options = {
            uri: url,
            auth: {
                user: AppConfig.BITBUCKET_USERNAME,
                pass: AppConfig.BITBUCKET_ACCESS_TOKEN
            },
            headers: {
                'User-Agent': 'nodejs'
            },
            resolveWithFullResponse: true,
            json: true
        };

        const { headers, body } = await rp(options);
        
        if (headers.status === 401 || headers.status === 403 || headers.status === 404) {
            throw new Error(body.message);
        }

        const link: IPagination = body.next ? { next : { url : body.next, rel: 'next', page: '' } } : {};

        const filterRepos: IRepoFilterProperties[] = body.values.map((repo: any )=> {
                                                                const m_repo: IRepoFilterProperties = {
                                                                    id: repo.uuid,
                                                                    name: repo.name,
                                                                    owner: {
                                                                        login: repo.owner.type === 'user' ? repo.owner.nickname : repo.owner.username,
                                                                        type: repo.owner.type
                                                                    },
                                                                    private: repo.is_private,
                                                                    html_url: repo.links.html.href,
                                                                    clone_url: repo.links.clone[0].href
                                                                };

                                                                return  m_repo;
                                                            });

        const response: IRepoResponse = { repos: filterRepos, link: link, provider: 'bitbucket'};
        return response;
    }

    public createRepo = async (repo_name: string) => {
        const baseUrl = 'https://api.bitbucket.org/2.0/repositories/' + AppConfig.BITBUCKET_USERNAME + '/';

        let uri = baseUrl + repo_name.toLowerCase();
        
        let options = {
            simple : false,
            method: 'POST',
            uri: uri,
            auth: {
                user: AppConfig.BITBUCKET_USERNAME,
                pass: AppConfig.BITBUCKET_ACCESS_TOKEN
            },
            headers: {
                'User-Agent': 'nodejs'
            },
            resolveWithFullResponse: true,
            body: {
                name: repo_name,
                scm: 'git',
                is_private: true,
                fork_policy: 'no_public_forks'
            },
            json: true
        };
        
        let { body, statusCode } = await rp(options);
        
        let count = 1;


        while (statusCode === 400) {
            const suffix = count++;
            options.uri = `${baseUrl}${repo_name.toLowerCase()}-${suffix}`;
            options.body.name = `${repo_name}-${suffix}`;
            const response = await rp(options);
            statusCode = response.statusCode;
            body = response.body;
        }

        const new_repo: IRepoFilterProperties = {
                                                    id: body.uuid,
                                                    name: body.name,
                                                    owner: {
                                                        login: body.owner.type === 'user' ? body.owner.nickname : body.owner.username,
                                                        type: body.owner.type
                                                    },
                                                    private: body.is_private,
                                                    html_url: body.links.html.href,
                                                    clone_url: body.links.clone[0].href
                                                };

        return new_repo;
    }

}
