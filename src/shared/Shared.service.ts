import * as shell from 'shelljs';
import * as fs from 'fs';
import * as ora from 'ora';
import * as progress from 'cli-progress';

export class SharedService {

    public cloneRepos = async (repos: string[]) => {

        if (!fs.existsSync(__dirname + '/../../git')) {
            fs.mkdirSync(__dirname + '/../../git/');
        }
        
        shell.cd(__dirname + '/../../git');

        
        const spinner = ora({
            text: `Cloning Repositories\n`,
        }).start();

        const bar = new progress.Bar({}, progress.Presets.shades_classic);
        let count = 1;
        bar.start(repos.length, count);
        
        repos.forEach( async (repo) => {
            shell.exec(`git clone ${repo}`, { silent: true });
            bar.update(++count);
        });

        bar.stop();
        spinner.text = 'Repositories Cloned Successfully\n';
        spinner.succeed();
        
    }
}