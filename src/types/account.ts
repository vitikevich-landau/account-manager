export interface Tag {
    text: string;
}

export enum AccountType {
    LOCAL = 'Локальная',
    LDAP = 'LDAP'
}

export interface Account {
    id: string;
    tags: Tag[];
    type: AccountType;
    login: string;
    password: string | null;
}

export interface AccountFormData {
    id: string;
    tagsString: string;
    type: AccountType;
    login: string;
    password: string;
    errors: {
        login?: string;
        password?: string;
    };
}