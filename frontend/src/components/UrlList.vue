<template>
  <div class="url-list">
    <h2>Your URLs</h2>

    <button @click="$emit('refresh')" class="refresh-btn">
      Refresh
    </button>

    <div v-if="urls.length === 0" class="empty">
      No URLs created yet
    </div>

    <ul v-else>
      <li v-for="url in urls" :key="url.shortUrl" class="url-item">
        <div class="url-info">
          <div class="short-url">
            <a :href="`/${url.shortUrl}`" target="_blank">
              {{ `${window.location.origin}/${url.shortUrl}` }}
            </a>
          </div>
          <div class="original-url">
            → {{ url.originalUrl }}
          </div>
          <div class="meta">
            <span>Clicks: {{ url.clickCount }}</span>
            <span>Created: {{ new Date(url.createdAt).toLocaleString() }}</span>
            <span v-if="url.expiresAt">
              Expires: {{ new Date(url.expiresAt).toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="actions">
          <button @click="showInfo(url.shortUrl)" class="info-btn">
            Info
          </button>
          <button @click="deleteUrl(url.shortUrl)" class="delete-btn">
            Delete
          </button>
        </div>
      </li>
    </ul>

    <div v-if="info" class="info-modal">
      <div class="info-content">
        <h3>URL Information</h3>
        <pre>{{ info }}</pre>
        <button @click="info = null" class="close-btn">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useApi } from '../services/api';

interface Url {
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
}

export default defineComponent({
  name: 'UrlList',
  props: {
    urls: {
      type: Array as PropType<Url[]>,
      required: true,
    },
  },
  emits: ['delete-url', 'refresh'],
  setup(props, { emit }) {
    const { getUrlInfo, deleteUrl: deleteUrlApi } = useApi();
    const info = ref<any>(null);
    const windowLocation = window.location;

    const showInfo = async (shortUrl: string) => {
      try {
        const response = await getUrlInfo(shortUrl);
        info.value = response.data;
      } catch (error) {
        console.error('Failed to get URL info:', error);
      }
    };

    const deleteUrl = async (shortUrl: string) => {
      try {
        await deleteUrlApi(shortUrl);
        emit('delete-url', shortUrl);
      } catch (error) {
        console.error('Failed to delete URL:', error);
      }
    };

    return {
      info,
      showInfo,
      deleteUrl,
      window: { location: windowLocation },
    };
  },
});
</script>

<style scoped>
.url-list {
  margin-top: 2rem;
}

.refresh-btn {
  margin-bottom: 1rem;
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty {
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

.url-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.url-info {
  flex: 1;
}

.short-url a {
  font-weight: bold;
  color: #42b983;
  text-decoration: none;
}

.original-url {
  color: #666;
  margin: 0.5rem 0;
  word-break: break-all;
}

.meta {
  font-size: 0.8rem;
  color: #888;
}

.meta span {
  margin-right: 1rem;
}

.actions button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.info-btn {
  background-color: #2196f3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.info-content {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

.close-btn {
  margin-top: 1rem;
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>