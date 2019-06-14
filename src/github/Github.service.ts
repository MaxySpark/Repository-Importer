import * as rp from 'request-promise';
import * as parse from 'parse-link-header';

import { AppConfig } from '../config/App.config';
import { IGithubRepoFilterProperties, IPagination } from '../interface/Github.interface';

export class GithubService {

    public getRepos = async () => {
        const options = {
            uri: 'https://api.github.com/user/repos',
            auth: {
                user: AppConfig.GITHUB_USERNAME,
                pass: AppConfig.GITHUB_PASSWORD
            },
            headers: {
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

        const filterRepos: IGithubRepoFilterProperties[] = body.map((repo: any )=> {
                                                            return {
                                                                name: repo.name,
                                                                private: repo.private,
                                                                html_url: repo.html_url,
                                                                clone_url: repo.clone_url
                                                            }
                                                        });
        return { repos: filterRepos, link: link};
    }

}
