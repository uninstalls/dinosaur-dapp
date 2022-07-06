import Web3 from 'web3';

export default class ContractBasic {
  constructor(paramaters, vue, web3) {
    this.vue = vue;
    this.web3 = web3 || new Web3(window.ethereum);

    this.methods = new Object();
    this.address = undefined;
    this.contract = this.initContract(paramaters);
  }

  initContract = (paramaters) => {
    const { file_name, abi, address } = paramaters;
    let complateABI = {abi: abi}, realAddress = address;

    if (typeof abi === 'undefined') {
      complateABI = require('@/contracts/' + file_name + '.json')
    }

    if (typeof address === 'undefined') {
      const networkId = this.vue.$store.state.networkId;
      if (typeof networkId === 'undefined')
        throw new Error(this.vue.$t('error.notConnectWallet'));

      if (typeof complateABI.networks[networkId] === 'undefined')
        throw new Error(this.vue.$t('error.notSupport'));

      realAddress = complateABI.networks[networkId].address;
    }
    
    this.address = realAddress;
    // console.log(this.address, 123123);
    this.contract = new this.web3.eth.Contract(
      complateABI.abi, realAddress
    );

    const self = this, contract = this.contract;

    const toWeiValue = (v, el) => {
      if (el.type !== 'payable') return 0;
      
      return this.contract.utils.toWei(v.toString());
    }, parseParamaters = (p, el) => {
      let parms = [];
      if (el.inputs.length <= 0) return parms;

      el.inputs.forEach((item) => {
        parms.push(p[item.name]);
      });

      return parms;
    }, parseErrorMessage = (e) => {
      // console.log(this.vue.$store.state.networkId)
      if (e.code == 4001) return self.vue.$t('error.signatureFaild');

      let rgx = /'message': '.+?'/g;
      const rgxResult = rgx.exec(e.toString());
      if (rgxResult) {
        var msg = Array.isArray(rgxResult) ? rgxResult[0] : rgxResult
        msg = JSON.parse('{'+msg+'}')
        return msg.message;
      } else {
        return e;
      }
    }, runTransfer = (element, paramaters) => {
      return new Promise((resolve, reject) => {
        if (!self.vue.$store.state.accounts)
          return reject(self.vue.$t('error.emptyAccounts'));

        const { value } = paramaters || {value: 0};
        const method = contract.methods[element.name];
        const m = element.stateMutability === 'view' ? 'call' : 'send';

        let data = { to: contract._address };
        data.from = self.vue.$store.state.accounts[0];
        data.value = toWeiValue(value, element);

        if (element.inputs.length <= 0) {
          method().estimateGas(data).then((gas) => {
            data.gas = gas;
            method()[m](data).then((res) => {
              return resolve(res);
            }).catch((e) => {
              return reject(parseErrorMessage(e));
            })
          }).catch((e) => {
            return reject(parseErrorMessage(e));
          })
        } else{
          let parms = parseParamaters(paramaters, element);
          method(...parms).estimateGas(data).then((gas) => {
            data.gas = gas;
            method(...parms)[m](data).then((res) => {
              return resolve(res);
            }).catch((e) => {
              return reject(parseErrorMessage(e));
            })
          }).catch((e) => {
            return reject(parseErrorMessage(e));
          })
        }
      });
    };

    this.contract._jsonInterface.forEach((element) => {
      if (element.type !== 'function') return;

      this.methods[element.name] = function() {
        return runTransfer(element, arguments[0]);
      }
    });
  }
}