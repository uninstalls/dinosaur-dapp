<template>
  <div class="data-panel">
    <div class="pool-balance">
      <span>{{ boolBalance.toFixed(2) }} </span>
      <span>{{ poolSymbol }}</span>
    </div>
    <!-- <b-img :src="bgImage" fluid></b-img> -->
    <!-- <div class="data-panel">asdf</div> -->
  </div>
</template>

<script>
  import { TestToken, Salvation } from '../utils/global.contract';

  export default {
    name: 'data-panel',
    data() {
      return {
        boolBalance: 0,
        poolSymbol: 'USDT'
      }
    },
    methods: {
      async getPoolBalance() {
        const web3 = this.$store.state.web3;

        const salvation = new Salvation(this, web3);
        const token = new TestToken(this, web3);

        // console.log(token.methods.symbol)

        // this.poolSymbol = await token.methods.symbol();

        const balance = await token.methods.balanceOf({
          account: salvation.address
        });

        this.boolBalance = parseFloat(web3.utils.fromWei(balance, 'ether'));
      }
    },
    computed: {
      networkId() {
        return this.$store.state.networkId;
      }
    },
    watch: {
      networkId: function () {
        this.getPoolBalance();
      }
    }
  }
</script>

<style scoped>
@font-face {
  font-family: digifaw;
  src: url(../assets/font/digifaw.ttf);
}

.data-panel {
  max-width: 100%;
  min-height: 820px;
  height: 100%;
  background: url(../assets/top_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  text-align: center;
}

.pool-balance {
  align-self: center;
  width: 100%;
  color: rgb(2, 233, 2);
  font-size: 42px;
  font-weight: bold;
  margin-top: 8%;
  font-family: digifaw;
}
</style>