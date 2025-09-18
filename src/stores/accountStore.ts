import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '@/types/account';

export const useAccountStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([]);

    function addAccount(account: Account) {
        accounts.value.push(account);
    }

    function updateAccount(id: string, account: Account) {
        const index = accounts.value.findIndex(a => a.id === id);
        if (index !== -1) {
            accounts.value[index] = account;
        }
    }

    function deleteAccount(id: string) {
        accounts.value = accounts.value.filter(a => a.id !== id);
    }

    return {
        accounts,
        addAccount,
        updateAccount,
        deleteAccount
    };
}, {
    persist: true
});