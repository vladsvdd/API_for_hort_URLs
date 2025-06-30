<template>
  <div class="container">
    <h1>URL Shortener</h1>
    <UrlForm @url-created="fetchUrls" />
    <UrlList
        :urls="urls"
        @delete-url="deleteUrl"
        @refresh="fetchUrls"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import UrlForm from '../components/UrlForm.vue';
import UrlList from '../components/UrlList.vue';
import { useApi } from '../services/api';

export default defineComponent({
  name: 'Home',
  components: {
    UrlForm,
    UrlList,
  },
  setup() {
    const { getUrls, deleteUrl: deleteUrlApi } = useApi();
    const urls = ref<any[]>([]);

    const fetchUrls = async () => {
      try {
        const response = await getUrls();
        urls.value = response.data;
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
      }
    };

    const deleteUrl = async (shortUrl: string) => {
      try {
        await deleteUrlApi(shortUrl);
        await fetchUrls();
      } catch (error) {
        console.error('Failed to delete URL:', error);
      }
    };

    onMounted(fetchUrls);

    return {
      urls,
      fetchUrls,
      deleteUrl,
    };
  },
});
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>