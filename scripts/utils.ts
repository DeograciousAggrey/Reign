import fs from 'fs';
import { ethers } from 'ethers';


const DEPLOYMENTS_DIR = `deployments`;
const MASK_250 = BigInt(2**250 - 1);

export function camelCase(str) {
  return str.split('-').map((_, i) => {
    if (i == 0) {
      return _;
    } else {
      return _[0].toUpperCase() + _.slice(1);
    }
  }).join('');
}

export function upperCase(str) {
  return str.split('-').map((_, i) => {
    return _[0].toUpperCase() + _.slice(1);
  }).join('');
}

export function getAddress(contract: string, network: string) {
  try {
    return JSON.parse(fs.readFileSync(`./deployments/${network}/${contract}.json`).toString()).address;
  } catch (err) {
    throw Error(`${contract} deployment on ${network} not found, run 'yarn deploy:${network}'`);
  }
}

export function getAccounts(network: string) {
  const files = fs.readdirSync(`./deployments/${network}`);
  return files.filter(file => file.slice(0, 7) === 'Account').map(file => {
    return file.split('-')[1].split('.')[0];
  });
}

export function parseCalldata(calldata: string, layer: number, network: string) {
  const _calldata = calldata ? calldata.split(',') : [];
  const accounts = getAccounts(network);
  return _calldata.map((input: string) => {
    if (accounts.includes(input)) {
      return BigInt(getAddress(`Account-${input}`, network)).toString();
    } else {
      return input;
    }
  });
}

export function save(name: string, contract: any, network: string) {
  fs.writeFileSync(`${DEPLOYMENTS_DIR}/${network}/${name}.json`, JSON.stringify({
    'address': contract.address,
  }));
}
