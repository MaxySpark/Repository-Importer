export interface IGithubRepoFilterProperties {
    name: string;
    private: boolean;
    html_url: string;
    clone_url: string;
}

export interface IPagination {
    prev?:  {
                page: string;
                rel: 'prev'|'next'|'last';
                url: string;
            };    
    next?:  {
                page: string;
                rel: 'prev'|'next'|'last';
                url: string;
            };
    last?:  {
                page: string;
                rel: 'prev'|'next'|'last';
                url: string;
            };
}