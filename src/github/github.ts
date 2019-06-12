import * as rp from 'request-promise';
import * as shell from 'shelljs';

import { AppConfig } from '../config/App.config';

class Github {
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
        return repos;
    }

    public cloneRepos = async (repos: string[]) => {
        shell.cd(__dirname + '/../../git');

        repos.forEach( async (repo) => {
            const {stderr, code} = shell.exec(`git clone ${repo}`, { silent: true });
            console.log(code);
        });
        
    }
}
