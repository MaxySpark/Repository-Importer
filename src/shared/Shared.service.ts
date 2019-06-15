import * as shell from 'shelljs';
import * as fs from 'fs';
import * as ora from 'ora';
import * as progress from 'cli-progress';
import { IUser } from '../interface';
import { AppConfig } from '../config/App.config';

export class SharedService {

    private modifyRepos = async (provider: 'github' | 'bitbucket', repos: string[]) => {

        const githubPrefix = `https://${AppConfig.GITHUB_ACCESS_TOKEN}@github.com/`;
        const bitbucketPrefix = `https://${AppConfig.BITBUCKET_USERNAME}:${AppConfig.BITBUCKET_ACCESS_TOKEN}@bitbucket.org/`;

        if (provider === 'github') {
            return repos.map(repo => githubPrefix + repo.split('/').slice(3).join('/'));
        } else {
            return repos.map(repo => bitbucketPrefix + repo.split('/').slice(3).join('/'));
        }
    }

    public cloneRepos = async (provider: 'github' | 'bitbucket', repos: string[]) => {

        const modify_repos = await this.modifyRepos(provider, repos);

        if (!fs.existsSync(__dirname + '/../../git')) {
            fs.mkdirSync(__dirname + '/../../git/');
        }
        
        shell.cd(__dirname + '/../../git');

        const spinner = ora({
            text: `Cloning Repositories\n`,
        }).start();

        const bar = new progress.Bar({}, progress.Presets.shades_classic);
        let count = 0;
        bar.start(repos.length, count);
        
        modify_repos.forEach( async (repo) => {
            shell.exec(`git clone ${repo}`, { silent: true });
            bar.update(++count);
        });

        bar.stop();
        spinner.text = 'Repositories Cloned Successfully\n';
        spinner.succeed();
        
    }

    
}