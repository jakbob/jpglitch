import Vue from 'vue';
import App from './app.vue';
import { JPGHelper } from './jpg-helper';
import './main.css';

Vue.filter('base64Jpeg', function (rawImage) {
  if (!rawImage) {
    return '';
  }
  var base64image = JPGHelper.toBase64(rawImage);
  return 'data:image/png;base64,' + base64image;
});

Vue.directive('jpgdrop', {
  bind(el, binding) {
    el.addEventListener('dragenter', (e) => {
      e.target.classList.add('dropover');
    });
    el.addEventListener('dragleave', (e) => {
      e.target.classList.remove('dropover');
    });
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      binding.value(e.dataTransfer.files[0]);
      e.target.classList.remove('dropover');
    });
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
});
