<!-- src/components/AccountItem.vue -->
<template>
  <div class="row mb-3 align-items-start">
    <!-- Метка -->
    <div class="col-12 col-md-3 mb-2 mb-md-0">
      <input
          type="text"
          class="form-control form-control-sm"
          v-model="formData.tagsString"
          @blur="handleBlur"
          placeholder="Метка1;Метка2"
          maxlength="50"
      />
    </div>

    <!-- Тип записи -->
    <div class="col-6 col-md-2 mb-2 mb-md-0">
      <select
          class="form-select form-select-sm"
          v-model="formData.type"
          @change="handleTypeChange"
      >
        <option :value="AccountType.LOCAL">Локальная</option>
        <option :value="AccountType.LDAP">LDAP</option>
      </select>
    </div>

    <!-- Логин -->
    <div :class="formData.type === AccountType.LDAP ? 'col-10 col-md-6' : 'col-6 col-md-3'" class="mb-2 mb-md-0">
      <input
          type="text"
          class="form-control form-control-sm"
          :class="{ 'is-invalid': formData.errors.login }"
          v-model="formData.login"
          @blur="handleBlur"
          placeholder="Значение"
          maxlength="100"
      />
      <div v-if="formData.errors.login" class="invalid-feedback">
        {{ formData.errors.login }}
      </div>
    </div>

    <!-- Пароль (только для локальных) -->
    <div v-if="formData.type === AccountType.LOCAL" class="col-10 col-md-3 mb-2 mb-md-0">
      <div class="input-group input-group-sm">
        <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="{ 'is-invalid': formData.errors.password }"
            v-model="formData.password"
            @blur="handleBlur"
            placeholder="••••••"
            maxlength="100"
        />
        <button
            class="btn btn-outline-secondary"
            type="button"
            @click="showPassword = !showPassword"
            tabindex="-1"
        >
          <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
        </button>
        <div v-if="formData.errors.password" class="invalid-feedback">
          {{ formData.errors.password }}
        </div>
      </div>
    </div>

    <!-- Кнопка удаления -->
    <div :class="formData.type === AccountType.LDAP ? 'col-2 col-md-1 ms-md-auto' : 'col-2 col-md-1'">
      <button
          class="btn btn-outline-danger btn-sm w-100"
          @click="$emit('delete')"
          type="button"
          title="Удалить"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { AccountType } from '@/types/account';
import type { Account, AccountFormData } from '@/types/account';

const props = defineProps<{
  account?: Account;
  isNew?: boolean;
}>();

const emit = defineEmits<{
  save: [account: Account];
  delete: [];
}>();

const showPassword = ref(false);
const hasBeenSaved = ref(false);

const formData = reactive<AccountFormData>({
  id: props.account?.id || crypto.randomUUID(),
  tagsString: props.account?.tags.map(t => t.text).join(';') || '',
  type: props.account?.type || AccountType.LOCAL,
  login: props.account?.login || '',
  password: props.account?.password || '',
  errors: {}
});

function validate(): boolean {
  formData.errors = {};

  // Проверяем обязательное поле логин
  if (!formData.login.trim()) {
    formData.errors.login = 'Обязательное поле';
  }

  // Проверяем пароль только для локальных учетных записей
  if (formData.type === AccountType.LOCAL && !formData.password.trim()) {
    formData.errors.password = 'Обязательное поле';
  }

  return Object.keys(formData.errors).length === 0;
}

function handleBlur() {
  // Валидируем только если хотя бы одно поле заполнено или уже была сохранена
  if (hasBeenSaved.value || formData.login || formData.password || formData.tagsString) {
    if (validate()) {
      saveAccount();
    }
  }
}

function handleTypeChange() {
  // При смене на LDAP очищаем пароль и ошибку пароля
  if (formData.type === AccountType.LDAP) {
    formData.password = '';
    delete formData.errors.password;
  }
  handleBlur();
}

function saveAccount() {
  // Преобразуем строку меток в массив объектов
  const tags = formData.tagsString
      .split(';')
      .filter(tag => tag.trim())
      .map(tag => ({ text: tag.trim() }));

  const account: Account = {
    id: formData.id,
    tags,
    type: formData.type,
    login: formData.login,
    password: formData.type === AccountType.LDAP ? null : formData.password
  };

  hasBeenSaved.value = true;
  emit('save', account);
}

// Если это существующая учетная запись, то она уже была сохранена
onMounted(() => {
  if (props.account) {
    hasBeenSaved.value = true;
  }
});
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
</style>