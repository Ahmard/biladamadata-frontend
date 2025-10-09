<template>
  <div class="steps">
    <progress :id="`progress-${progress_id}`" :value="progress" max=100 class="stepper-progress"></progress>
    <slot />
  </div>
</template>

<script>
export default {
  name: "Stepper",
  props: {
    progress: {default: 0}
  },
  data(){
    return {
      progress_id: Date.now(),
    }
  },
  mounted() {
    setTimeout(() => {
      const stepButtons = document.querySelectorAll('.step-button');
      const progress = document.querySelector(`#progress-${this.progress_id}`);

      Array.from(stepButtons).forEach((button,index) => {
        button.addEventListener('click', () => {
          progress.setAttribute('value', index * 100 /(stepButtons.length - 1) );//there are 3 buttons. 2 spaces.

          stepButtons.forEach((item, secindex)=>{
            if(index > secindex){
              item.classList.add('done');
            }
            if(index < secindex){
              item.classList.remove('done');
            }
          })
        })
      })
    }, 1000)
  }
}
</script>

<style scoped>

</style>
