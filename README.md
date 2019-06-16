# Repository-Importer
#### Import Repository From Github to Bitbucket and Bitbucket to Github

## Prerequisite
 * [x] NodeJS and NPM

## Installation and Configuration
  1. **Download or Clone This Repo [Click Here](https://github.com/MaxySpark/Repository-Importer/archive/master.zip)**
  2. **Open a terminal In The Cloned Directory**
  3. **Run `$ npm install`**
  4. **Rename the `example.env` file to `.env`**
  5. **Generate a Github Personal Access Token with Scope `repo`. Copy it and replace with the `xxx` in `.env` `GITHUB_ACCESS_TOKEN="xxx"`**
  
     - [Learn Here](#create-github-personal-access-token) How to Create Your Github Personal Access Token
  6. **Replace the `username` in `.env` `BITBUCKET_USERNAME="username"`**
  
     - [Click Here](https://bitbucket.org/account) To Know Your Bitbucket Username
  7. **Create A App Password in Bitbucket with Permission `Repositories`. Copy it and replace with the `xxx` in `.env` `BITBUCKET_ACCESS_TOKEN="xxx"`**
     
     - [Learn Here](#create-bitbucket-app-password) How to Create A App Password in Bitbucket
     
## User Guide
  - **Run `$ npm start`**
    
    It will promt to choose a site(Github/Bitbucket) from which you want to import the repository.
    
    ![Uses](https://i.imgur.com/uYTcdFf.png "Uses 1")

   - **After choosing a site it will fetch your repositories. Use `arrow` keys to go up and down, select the repos with `space` key and hit enter to import the repository to Other site(Bitbucket/Github).**
   
     ![Uses](https://i.imgur.com/8kTayZH.png "Uses 2")
   
   - **You Can also type your repository name to search in the list**
    
     ![Uses](https://i.imgur.com/wKLzxe3.png "Uses 3")
   
   - **After Import Task Complete it Will Ask You If You Want to Import More From The Selected Site**
      
     ![Uses](https://i.imgur.com/USHuKqr.png "Uses 4")
     
   - **If You Choose Yes(_press y_) then it will ask to choose the page from pagination**
     
      ![Uses](https://i.imgur.com/ycJfviG.png "Uses 5")
      
   - **And The Process will repeat.**
    
   - **If You Can't Find A Repo in the first page/list, it is in other pages. To Directly go to other pages don't select any repo in the first list and hit enter and it will ask you _If You Want to Import More_ `press y` then select the next page**
     
     ![Uses](https://i.imgur.com/RmxphMR.png "Uses 6")
     
     ![Uses](https://i.imgur.com/iRsXBUW.png "Uses 7")
     
     
## Create Github Personal Access Token
  - **[Go To Github Access Token Page](https://github.com/settings/tokens)**
    
    ![Geneate PAT](https://i.imgur.com/qbXCVST.png "Geneate PAT 1")
  - **Click Generate Token**
  - **Copy and Save The Generated Token for Future Uses**
    
    ![Geneate PAT](https://i.imgur.com/aH5RBpi.png "Geneate PAT 2")
    
## Create Bitbucket App Password
   - **[Visit This Link For Complete Instructions](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html)**
   - **Go to [Bitbucket Account](https://bitbucket.org/account) > ACCESS MANAGEMENT > App passwords > Create app password**
   - **Give a label. Tick all option under repositories **
   
     ![App Password](https://i.imgur.com/vYcvgKv.png "App Password 1")
   - **Click Create**
   - **Copy The Password and Save it for Future Uses**
   
     ![App Password](https://i.imgur.com/1UyPJvi.png "App Password 2")
     
  
## Todo
   * [] Fetch Repo From Next Pages While Typing/Searching

## Contribute
  - **PRs are Welcome :blush:**
