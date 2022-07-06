<template>
  <div class="rescu-panel">
    <div class="rescu-detail">
      <div>
        <div>
          <span class="count-down-title">{{ $t('home.rescuTitle') }}</span>
          <span class="count-down-time">{{ stageDelay }}</span>
        </div>
        <div class="count-down-uint">
          <div><span>{{ $t('home.cdDay') }}</span></div>
          <div><span>{{ $t('home.cdHour') }}</span></div>
          <div><span>{{ $t('home.cdMinute') }}</span></div>
          <div><span>{{ $t('home.cdSecond') }}</span></div>
        </div>
      </div>
      <div class="rescu-bar">
        <span>{{ $t('home.btnSave') }}</span>
      </div>
      <div class="nft-item-list">
        <div class="nft-item-dinosaur" v-if="currentStage != 0">
          <div class="escape-wheel">
            <div class="btn-wheel"></div>
          </div>
        </div>
        <div class="nft-item-dinosaur" v-for="num of parseInt(stage[3] || 0)" :key="num">
          <div class="nft-item-wheel" :item="num">
            <div class="btn-wheel"></div>
          </div>
        </div>
      </div>
      <div class="info-detail">
        <span class="green">{{ $t('home.infoFirst') }} </span>
        <span class="red">{{ escapeCard }} {{ $t('home.infoSecond') }}</span>
        <span class="green"> {{ $t('home.infoThird') }} </span>
        <span class="red">{{ stage[3] || 0 }} {{ $t('home.infoForth') }}</span>
        <span class="green"> {{ $t('home.infoFifth') }}</span>
      </div>
      <div class="salvation">
        <div class="salvation-bar">
          <span>{{ $t('home.dinRemains') }} {{ escapeCard }}000</span>
        </div>
        <div class="salvation-btn"><span>{{ $t('home.btnJoinUs') }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Salvation } from '../utils/global.contract';

  export default {
    name: 'data-panel',
    data() {
      return {
        stage: [],
        currentStage: 0,
        stageDelay: '00 : 00 : 00 : 00',
        tiCountDown: undefined,
        escapeCard: 1,
      }
    },
    created() {
      
    },
    methods: {
      async getStageDetail() {
        const web3 = this.$store.state.web3;
        const salvation = new Salvation(this, web3);
        this.stage = await salvation.methods.getStageDetail();
        this.currentStage = await salvation.methods.CURRENT_STAGE();
        // if (this.stage) this.countDown();

        // console.log(this.stage)
        // console.log(this.currentStage)
        this.stage = [0,0,0,3,0,0,0,0];
        this.currentStage = 1;
      },
      calculateTime(a, b, c) {
        const difference = (parseInt(a) + parseInt(b) - c) * 1000;
        const days = this.formatZero(Math.floor(difference / (24 * 3600 * 1000)), 2);

        const mSecond = difference % (24 * 3600 * 1000);
        const hours = this.formatZero(Math.floor(mSecond / (3600 * 1000)), 2);

        const msSecond = mSecond % (3600 * 1000);
        const minutes = this.formatZero(Math.floor(msSecond / (60 * 1000)), 2);

        const second = msSecond % (60 * 1000);
        const seconds = this.formatZero(Math.round(second / 1000), 2);

        console.log(days, '天', hours, '时', minutes, '分', seconds, '秒')
        return days + ' : ' + hours + ' : ' + minutes + ' : ' + seconds;
      },
      formatZero(num, len) {
        if (String(num).length > len) return num;
        return (Array(len).join(0) + num).slice(-len);
      },
      countDown() {
        this.tiCountDown = setInterval(() => {
          const timestamp = Date.parse(new Date()) / 1000;
          // console.log((parseInt(this.stage[8]) + parseInt(this.stage[7])) - timestamp)
          if ((parseInt(this.stage[8]) + parseInt(this.stage[7])) - timestamp <= 0)
            clearInterval(this.tiCountDown);

          this.stageDelay = this.calculateTime(this.stage[8], this.stage[7], timestamp);
        }, 1000);
      }
    },
    computed: {
      networkId() {
        return this.$store.state.networkId;
      }
    },
    watch: {
      networkId: function () {
        this.getStageDetail();
      }
    }
  }
</script>

<style scoped>
.rescu-panel {
  max-width: 100%;
  min-height: 820px;
  height: 100%;
  background: url(../assets/rescu_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
}

.rescu-detail {
  width: 100%;
  padding-top: 8.6%;
}

.count-down-title {
  font-size: 28px;
  color: #ffffff;
  font-weight: bold;
}

.count-down-time {
  font-size: 48px;
  color: red;
  font-weight: bold;
}

.count-down-uint {
  margin-top: -15px;
  margin-left: 330px;
}

.count-down-uint div {
  width: 100px;
  display: inline-block;
}

.count-down-uint span {
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
}

.rescu-bar {
  max-width: 67%;
  min-height: 73px;
  height: 100%;
  background: url(../assets/rescu_bar.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: center;
  margin: 0px auto;
}

.rescu-bar span {
  line-height: 75px;
  font-weight: bold;
  font-size: 34px;
}

.nft-item-list {
  margin-top: 10px;
}

.nft-item-wheel {
  display: inline-block;
  background: url(../assets/normal_wheel.png);
  background-size: 100% 100%;
  width: 209px;
  height: 160px;
}

.nft-item-dinosaur {
  display: inline-block;
  background: url(../assets/dinosaur.png);
  /* background: url(../assets/dinosaur.png), url(../assets/escape_wheel_bg.png); */
  background-size: 60% 60%;
  background-repeat: no-repeat;
  background-position: 12px 35px;
  width: 209px;
  height: 160px;
  /* margin-right: 10px; */
}

.escape-wheel {
  background: url(../assets/escape_wheel.png);
  display: inline-block;
  background-size: 100% 100%;
  width: 209px;
  height: 160px;
}

.btn-wheel {
  background: url(../assets/btn_wheel.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  float: right;
  width: 68px;
  height: 68px;
  margin-top: 95px;
}

.btn-wheel:hover {
  background: url(../assets/btn_wheel_hover.png);
  background-size: 68px 65px;
  background-repeat: no-repeat;
}

@media screen and (min-width: 1440px) {
  .nft-item-list {
    min-height: 160px;
  }
  .nft-item-wheel {
    /* width: 14.5%; */
    width: 209px;
    height: 160px;
  }
  .escape-wheel {
    /* width: 14.5%; */
    width: 209px;
    height: 160px;
  }

  .nft-item-dinosaur {
    width: 209px;
    height: 160px;
  }

  .btn-wheel {
    width: 68px;
    height: 68px;
    margin-top: 95px;
  }

  .btn-wheel:hover {
    background-size: 68px 65px;
  }

  .rescu-detail {
    padding-top: 120px;
  }
}

@media screen and (min-width: 1920px) {
  .nft-item-list {
    min-height: 198px;
  }
  .nft-item-wheel {
    /* width: 13.5%; */
    width: 259px;
    height: 198px;
  }
  .escape-wheel {
    /* width: 14.5%; */
    width: 259px;
    height: 198px;
  }

  .nft-item-dinosaur {
    width: 259px;
    height: 198px;
  }

  .btn-wheel {
    width: 81px;
    height: 81px;
    margin-top: 117px;
  }

  .btn-wheel:hover {
    background-size: 81px 81px;
  }

  .rescu-detail {
    padding-top: 185px;
  }
}

.wheel {
  /* width: 9.5%; */
  width: 100%;
  cursor: pointer;
  /* z-index: 999; */
  /* overflow: hidden; */
  /* position: fixed; */
  /* right: 0px; */
  /* bottom: 0px; */
}

.info-detail {
  padding-top: 40px;
  font-weight: bold;
}

.green {
  color: rgb(2, 233, 2);
}

.red {
  color: red;
}

.salvation {
  margin: 0px auto;
  margin-top: 30px;
  max-width: 50%;
}

.salvation-bar {
  /* max-width: 35%; */
  min-height: 53px;
  width: 80%;
  height: 100%;
  background: url(../assets/salvation_bar.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-align: left;
  /* margin: 40px auto; */
  /* display: inline-block; */
  float: left;
  margin-top: 16px;
}

.salvation-bar span {
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  line-height: 46px;
  margin-left: 30%;
}

.salvation-btn {
  /* display: inline-block; */
  width: 20%;
  height: 68px;
  float: left;
  color: #ffffff;
  font-weight: bold;
  background: url(../assets/btn_salvation.png);
  background-size: 100% 100%;
  cursor: pointer;
}

.salvation-btn:hover {
  /* display: inline-block; */
  width: 20%;
  height: 68px;
  float: left;
  color: #ffffff;
  font-weight: bold;
  background: url(../assets/btn_salvation_hover.png);
  background-size: 100% 100%;
  cursor: pointer;
}

.salvation-btn span {
  font-weight: bold;
  font-size: 32px;
  color: #674308;
  line-height: 68px;
}
</style>