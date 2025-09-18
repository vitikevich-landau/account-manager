<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Учетные записи</h5>
        <button
            class="btn btn-primary btn-sm"
            @click="addNewAccount"
            type="button"
        >
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>

      <div class="card-body">
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle"></i>
          Для указания нескольких меток для одной пары логин-пароль используйте разделитель ;
        </div>

        <!-- Заголовки колонок -->
        <div class="row mb-2 fw-bold text-muted small">
          <div class="col-md-3">Метки</div>
          <div class="col-md-2">Тип записи</div>
          <div class="col-md-3">Логин</div>
          <div class="col-md-3">Пароль</div>
          <div class="col-md-1"></div>
        </div>

        <!-- Список учетных записей -->
        <div v-for="account in displayAccounts" :key="account.id">
          <AccountItem
              :account="account"
              @save="handleSave"
              @delete="handleDelete(account.id)"
          />
        </div>

        <div v-if="displayAccounts.length === 0" class="text-center text-muted py-4">
          Нажмите "+" чтобы добавить учетную запись
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import AccountItem from './AccountItem.vue';
import type { Account } from '@/types/account';
import {AccountType} from "@/types/account";

const accountStore = useAccountStore();
const newAccounts = ref<string[]>([]);

const displayAccounts = computed(() => {
  const savedAccounts = accountStore.accounts;
  const unsavedAccounts = newAccounts.value.map(id => ({ id } as Account));
  return [...savedAccounts, ...unsavedAccounts];
});

function addNewAccount() {
  const newAccount: Account = {
    id: crypto.randomUUID(),
    tags: [],                // ← обязательно пустой массив
    type: AccountType.LOCAL, // дефолтный тип
    login: '',
    password: ''             // для LDAP потом можно обнулить до null
  };

  accountStore.addAccount(newAccount);
}

function handleSave(account: Account) {
  // Удаляем из новых, если это новая запись
  const newIndex = newAccounts.value.indexOf(account.id);
  if (newIndex !== -1) {
    newAccounts.value.splice(newIndex, 1);
    accountStore.addAccount(account);
  } else {
    accountStore.updateAccount(account.id, account);
  }
}

function handleDelete(id: string) {
  const newIndex = newAccounts.value.indexOf(id);
  if (newIndex !== -1) {
    newAccounts.value.splice(newIndex, 1);
  } else {
    accountStore.deleteAccount(id);
  }
}
</script>