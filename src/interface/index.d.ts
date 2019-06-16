export interface IRepoFilterProperties {
    id: string | number;
    name: string;
    owner: {
        login: string;
        type: 'User' | 'Organization' | 'user' | 'team';
    };
    private: boolean;
    html_url: string;
    clone_url: string;
    push_url?: string;
}

export interface IPagination {
    first?: {
                page: string;
                rel: 'first';
                url: string;
            };
    prev?:  {
                page: string;
                rel: 'prev';
                url: string;
            };    
    next?:  {
                page: string;
                rel: 'next';
                url: string;
            };
    last?:  {
                page: string;
                rel: 'last';
                url: string;
            };
}

export interface IRepoResponse {
    provider: 'github' | 'bitbucket';
    repos: IRepoFilterProperties[];
    link: IPagination;
}

export interface IUser {
    username: string;
    password: string;
}