export default {
  beforeMount(el, binding) {
    const handleClick = (event) => {
      if (event.target.classList.contains('main-preloader')) return;
      if (event.target.closest('[data-ignore-click]')) return;

      if (!el.contains(event.target) && el !== event.target) {
        binding.value();
      }
    };

    setTimeout(() => document.addEventListener('click', handleClick));
    el._clickOutside = handleClick;
    el._binding = binding;
  },
  updated(el, binding) {
    el._binding = binding;
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  },
};
