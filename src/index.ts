import 'dotenv/config';
import { App } from "./App";

(async () => {
    try {
        const app = new App();
        const provider = await app.selectProvider();

        if (!provider) {
            return;
        }

        let repositoryObject = await app.getRepos(provider);
        
        let selectedRepos = await app.selectRepos(repositoryObject.repos);

        if (selectedRepos && selectedRepos.length !== 0) {
            await app.cloneRepos(provider, selectedRepos);
            const repo_w_push = await app.getPushRepoUrls(provider, selectedRepos);
            await app.pushRepos(provider, repo_w_push);
        }
        
        let repeat = true;

        while (repeat) {

            if (Object.keys(repositoryObject.link).length > 0) {
                repeat = await app.isRepeat();
            
                if (repeat) {
                    repositoryObject = await app.fetchMoreRepos(provider, repositoryObject);
                    
                    if (!repositoryObject) {
                        return;
                    }

                    selectedRepos = await app.selectRepos(repositoryObject.repos);
    
                    if (selectedRepos && selectedRepos.length !== 0) {
                        await app.cloneRepos(provider, selectedRepos);
                        const repo_w_push = await app.getPushRepoUrls(provider, selectedRepos);
                        await app.pushRepos(provider, repo_w_push);
                    }
                }
            } else {
                repeat = false;
            }

        }
        
        

        
    } catch(e) {
        console.log(e.message);
    }
})();