export interface IGithubRepoFilterProperties {
    name: string;
    owner: {
        login: string;
        type: 'User' | 'Organization';
    };
    private: boolean;
    html_url: string;
    clone_url: string;
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

export interface IGithubRepoResponse {
    provider: string;
    repos: IGithubRepoFilterProperties[];
    link: IPagination;
}