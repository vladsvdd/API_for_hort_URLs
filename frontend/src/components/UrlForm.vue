<template>
  <div class="url-form">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="originalUrl">Original URL</label>
        <input
            id="originalUrl"
            v-model="originalUrl"
            type="url"
            required
            placeholder="https://example.com"
        />
      </div>

      <div class="form-group">
        <label for="alias">Custom Alias (optional)</label>
        <input
            id="alias"
            v-model="alias"
            type="text"
            maxlength="20"
            placeholder="my-alias"
        />
      </div>

      <div class="form-group">
        <label for="expiresAt">Expiration Date (optional)</label>
        <input
            id="expiresAt"
            v-model="expiresAt"
            type="datetime-local"
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Creating...' : 'Create Short URL' }}
      </button>
    </form>

    <div v-if="shortUrl" class="result">
      <p>Your short URL: <a :href="shortUrl" target="_blank">{{ shortUrl }}</a></p>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApi } from '../services/api';

export default defineComponent({
  name: 'UrlForm',
  emits: ['url-created'],
  setup(props, { emit }) {
    const { createShortUrl } = useApi();
    const originalUrl = ref('');
    const alias = ref('');
    const expiresAt = ref('');
    const shortUrl = ref('');
    const error = ref('');
    const isLoading = ref(false);

    const submitForm = async () => {
      isLoading.value = true;
      error.value = '';

      try {
        const response = await createShortUrl(
            originalUrl.value,
            alias.value || undefined,
            expiresAt.value || undefined
        );

        shortUrl.value = `${window.location.origin}/${response.data.shortUrl}`;
        emit('url-created');
      } catch (err: any) {
        error.value = err.response?.data?.error || 'Failed to create short URL';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      originalUrl,
      alias,
      expiresAt,
      shortUrl,
      error,
      isLoading,
      submitForm,
    };
  },
});
</script>

<style scoped>
.url-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffebee;
  color: #f44336;
  border-radius: 4px;
}
</style>