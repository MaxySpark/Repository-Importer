import 'dotenv/config';
import { App } from "./App";
import { SharedService } from './shared/Shared.service';

(async () => {
    try {
        const app = new App();
        const sharedService = new SharedService();
        
        const provider = await app.selectProvider();
        
        const repositoryObject = await app.getRepos(provider);
        
        const selectedRepos: string[] = await app.selectRepos(repositoryObject.repos);

        await sharedService.cloneRepos(selectedRepos);

        console.log(repositoryObject.link);
    } catch(e) {
        console.log(e.message);
    }
})();