import { onMounted } from 'vue';

export function useMetaTags(title, description = '') {
  onMounted(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.remove();
    }

    if (description) {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = description;
      document.head.appendChild(newMetaDescription);
    }
  });
}
