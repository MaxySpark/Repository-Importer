import * as rp from 'request-promise';
import * as parse from 'parse-link-header';

import { AppConfig } from '../config/App.config';
import { IGithubRepoFilterProperties, IPagination } from '../interface/Github.interface';

export class GithubService {

    public getRepos = async () => {
        const options = {
            uri: 'https://api.github.com/user/repos',
            headers: {
                'Authorization': 'token ' + AppConfig.PERSONAL_ACCESS_TOKEN,
                'User-Agent': 'nodejs'
            },
            resolveWithFullResponse: true,
            body: {
                visibility: 'private'
            },
            json: true
        };
        const { headers, body } = await rp(options);

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
