import * as shell from 'shelljs';
import * as fs from 'fs';
import * as ora from 'ora';
import * as progress from 'cli-progress';
import { IRepoFilterProperties } from '../interface';
import { AppConfig } from '../config/App.config';

export class SharedService {

    private modifyCloneRepos = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {

        const githubPrefix = `https://${AppConfig.GITHUB_ACCESS_TOKEN}@github.com/`;
        const bitbucketPrefix = `https://${AppConfig.BITBUCKET_USERNAME}:${AppConfig.BITBUCKET_ACCESS_TOKEN}@bitbucket.org/`;

        if (provider === 'github') {
            return repos.map((repo: IRepoFilterProperties) => {
                                        return {
                                            ...repo,
                                            clone_url: githubPrefix + repo.clone_url.split('/').slice(3).join('/')
                                        }    
                                    });
        } else {
            return repos.map((repo: IRepoFilterProperties) => {
                                        return {
                                                ...repo,
                                                clone_url: bitbucketPrefix + repo.clone_url.split('/').slice(3).join('/')
                                            }    
                                        });
        }
    }

    private modifyPushRepos = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {

        const githubPrefix = `https://${AppConfig.GITHUB_ACCESS_TOKEN}@github.com/`;
        const bitbucketPrefix = `https://${AppConfig.BITBUCKET_USERNAME}:${AppConfig.BITBUCKET_ACCESS_TOKEN}@bitbucket.org/`;

        if (provider === 'github') {
            return repos.map((repo: IRepoFilterProperties) => {
                                        return {
                                            ...repo,
                                            push_url: githubPrefix + repo.push_url.split('/').slice(3).join('/')
                                        }    
                                    });
        } else {
            return repos.map((repo: IRepoFilterProperties) => {
                                        return {
                                                ...repo,
                                                push_url: bitbucketPrefix + repo.push_url.split('/').slice(3).join('/')
                                            }    
                                        });
        }
    }

    public cloneRepos = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {

        const modify_repos = await this.modifyCloneRepos(provider, repos);

        if (!fs.existsSync(__dirname + '/../../git')) {
            fs.mkdirSync(__dirname + '/../../git/');
        }
        
        shell.cd(__dirname + '/../../git');
        shell.rm('-rf', '*');

        const spinner = ora({
            text: `Cloning Repositories\n`,
        }).start();

        const bar = new progress.Bar({}, progress.Presets.shades_classic);
        let count = 0;
        bar.start(repos.length, count);
        
        modify_repos.forEach( async (repo) => {
            shell.exec(`git clone --bare ${repo.clone_url} ${repo.id}`, { silent: true });
            bar.update(++count);
        });

        bar.stop();
        spinner.text = 'Repositories Cloned Successfully\n';
        spinner.succeed();
        
    }

    public pushRepos = async (provider: 'github' | 'bitbucket', repos: IRepoFilterProperties[]) => {
        const modify_repos = await this.modifyPushRepos(provider, repos);
        
        shell.cd(__dirname + '/../../git');

        const spinner = ora({
            text: `Pushing Repositories\n`,
        }).start();

        const bar = new progress.Bar({}, progress.Presets.shades_classic);
        let count = 0;
        bar.start(repos.length, count);
        
        modify_repos.forEach( async (repo) => {
            shell.cd(`${repo.id}`);
            shell.exec(`git push --mirror ${repo.push_url}`, { silent: true });
            bar.update(++count);
            shell.cd('..');
        });

        shell.rm('-rf', '*');
        bar.stop();
        spinner.text = 'Repositories Imported Successfully\n';
        spinner.succeed();
        console.log('Imported Repository List: \n');
        modify_repos.forEach((repo) => {
            console.log(`* ${repo.owner.login} : ${repo.name}\n`);
        })
    }

    
}