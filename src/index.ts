import 'dotenv/config';
import { App } from "./App";
import { SharedService } from './shared/Shared.service';

(async () => {
    try {
        const app = new App();
        const sharedService = new SharedService();
        
        const provider = await app.selectProvider();

        if (!provider) {
            return;
        }

        let repositoryObject = await app.getRepos(provider);
        
        let selectedRepos = await app.selectRepos(repositoryObject.repos);

        if (selectedRepos && selectedRepos.length !== 0) {
            await sharedService.cloneRepos(provider, selectedRepos);
        }
        
        let repeat = true;

        while (repeat) {

            if (Object.keys(repositoryObject.link).length > 0) {
                repeat = await app.isRepeat();
            
                if (repeat) {
                    repositoryObject = await app.fetchMoreRepos(provider, repositoryObject);
    
                    selectedRepos = await app.selectRepos(repositoryObject.repos);
    
                    if (selectedRepos && selectedRepos.length !== 0) {
                        await sharedService.cloneRepos(provider, selectedRepos);
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