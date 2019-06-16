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

}
