<template>
  <div id="app">
    <data-panel-vue></data-panel-vue>
    <rescu-dinosaur-vue></rescu-dinosaur-vue>
  </div>
</template>

<script>
import DataPanelVue from './components/DataPanel.vue';
import RescuDinosaurVue from './components/RescuDinosaur.vue';

export default {
  name: 'App',
  components: { DataPanelVue, RescuDinosaurVue },
  async mounted() {
    const chainId = await this.$store.state.web3.eth.getChainId();
    this.$store.state.networkId = chainId;
    this.$store.state.networkId = '1657070619593';
    this.$store.state.accounts = ['0x92F4D033e44576B8672C6F46B35f8aB803151413'];
  }
}
</script>

<style>
body { margin: 0px; }
html, body {
  width: 100%;
  height: 100%;
  min-width: 1440px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
}
</style>
