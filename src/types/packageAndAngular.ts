// Tipos para package.json e angular.json

export interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    [key: string]: unknown;
}

export interface AngularJson {
    projects?: {
        [key: string]: {
            architect?: {
                build?: {
                    options?: {
                        baseHref?: string;
                    };
                    configurations?: {
                        production?: {
                            baseHref?: string;
                        };
                    };
                };
                serve?: {
                    options?: {
                        baseHref?: string;
                    };
                };
            };
        };
    };
}
