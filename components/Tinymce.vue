<template>
  <div>
    <Label :for="id">{{ label }}</Label>
    <textarea :id="id" :placeholder="placeholder"></textarea>
  </div>
</template>

<script>
const textareaIdentifier = `tinymce-textarea-${Date.now()}`;
let current_value = null;

function initTinyMCE(nuxt) {

  const valueEmitter = (editor) => {
    current_value = editor.getContent()
    nuxt.$emit('input', current_value)
  };

  tinymce.init({
    selector: `textarea#${textareaIdentifier}`,
    plugins: 'emoticons lists advlist link autolink charmap image autosave template fullscreen table preview wordcount code media',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | bullist | numlist',
    setup: editor => {
      editor.on('init', function() {
        console.log(`Initialized tinymce: textarea#${textareaIdentifier}`);
      });

      editor.on('keyup', () => valueEmitter(editor));
      editor.on('change', () => valueEmitter(editor));
    }
  })
}

export default {
  name: "Tinymce",
  props: {
    value: {default: ''},
    label: {default: 'Content'},
    placeholder: {default: 'Your content here...'},
    id: {default: textareaIdentifier},
  },
  watch: {
    value(val) {
      if (val !== current_value) {
        tinymce.get(this.id).setContent(val ?? '');
      }
    }
  },
  head() {
    return {
      title: 'Send Mail',
      script: [
        {
          src: '/tinymce/tinymce.min.js',
          callback: () => initTinyMCE(this)
        }
      ]
    }
  },
  methods: {initTinyMCE},
  mounted() {
    if (typeof window.tinymce !== 'undefined') {
      this.initTinyMCE(this)
    }
  }
}
</script>

<style scoped>

</style>
