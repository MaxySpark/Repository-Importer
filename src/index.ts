import 'dotenv/config';
import { App } from "./App";

(async () => {
    try {
        const app = new App();
        const provider = await app.selectProvider();
        console.log('Fetching Repos...');
        const repos = await app.getRepos(provider);
        repos.forEach(repo => {
            console.log(repo.name,':',repo.html_url);
        })
    } catch(e) {
        console.log(e.message);
    }
})();