import ContractBasic from './contract.basic';

export class ERC20Token extends ContractBasic {
  constructor(address, vue, web3) {
    super({file_name: "IERC20", address: address}, vue, web3);
  }
}

export class TestToken extends ContractBasic {
  constructor(vue, web3) {
    super({file_name: "TestToken"}, vue, web3);
  }
}

export class Salvation extends ContractBasic {
  constructor(vue, web3) {
    super({file_name: "Salvation"}, vue, web3);
  }
}