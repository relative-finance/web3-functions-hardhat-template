import { Interface } from "@ethersproject/abi";
import {
  Web3Function,
  Web3FunctionEventContext,
} from "@gelatonetwork/web3-functions-sdk";

import * as EventEmitterAbi from './abis/EventEmitter.json';
import * as OrderHandlerAbi from './abis/OrderHandler.json';
import * as DepositHandlerAbi from './abis/DepositHandler.json';
import * as WithdrawalHandlerAbi from './abis/WithdrawalHandler.json';

import PythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json";

import { decodeEventData, getOracleParams } from "./utils"
import { MarketProps, marketProps, config } from "./config"
import { Contract, ethers } from "ethers";

Web3Function.onRun(async (context: Web3FunctionEventContext) => {
  const { log, secrets } = context;

  const HERMES_ENDPOINT = await secrets.get("HERMES_ENDPOINT");
  const KEEPER_PRIVATE_KEY = await secrets.get("KEEPER_PRIVATE_KEY");

  try {
    // Parse the event from the log using the provided event ABI
    console.log("parsing event");
    const contractInterface = new Interface(EventEmitterAbi);
    const event = contractInterface.parseLog(log);

    if (
      event.args[1] != "DepositCreated" &&
      event.args[1] != "OrderCreated" &&
      event.args[1] != "WithdrawalCreated"
    ) {
      console.log(`event found: ${event.args[1]}, ignoring`)
      return { canExec: false, message: `event found: ${event.args[1]}, ignoring`};
    }

    const {
      key,
      market,
      orderType,
      swapPath,
      longTokenSwapPath,
      shortTokenSwapPath,
    } = decodeEventData(event.args[5]);

    if (
      event.args[1] == "OrderCreated" &&
      orderType != 0 &&
      orderType != 2 &&
      orderType != 4
    ) {
      console.log(`order type found: ${orderType}, ignoring`)
      return { canExec: false, message: `order type found: ${orderType}, ignoring`};
    }

    console.log(`order tx: ${log.transactionHash}`);

    let props: MarketProps[] = [];
    props.push(marketProps[market])

    for (let i = 0; i < longTokenSwapPath.length; i++) {
      props.push(marketProps[longTokenSwapPath[i]]);
    }
    for (let i = 0; i < shortTokenSwapPath.length; i++) {
      props.push(marketProps[shortTokenSwapPath[i]]);
    }
    for (let i = 0; i < swapPath.length; i++) {
      props.push(marketProps[swapPath[i]]);
    }

    // TODO: use gelato's inbulit multi chain provider instead of a custom one
    const provider = new ethers.providers.JsonRpcProvider(config.RPC);
    const signer = new ethers.Wallet(KEEPER_PRIVATE_KEY!, provider);
    
    const pythContract = new Contract(
      config.PythOracle,
      PythAbi,
      signer
    );

    const blockTimestamp = (await provider.getBlock(log.blockNumber)).timestamp;
    const { oracleParams, updateFee } = await getOracleParams(props, blockTimestamp, pythContract, HERMES_ENDPOINT!);

    let res;

    if (event.args[1] == "DepositCreated") {
      const depositHandler = new Contract(
        config.DepositHandler,
        DepositHandlerAbi,
        signer
      );
      res = await depositHandler.executeDeposit(key, oracleParams, {
        value: updateFee, gasLimit: 10000000
      });
    }
    
    else if (event.args[1] == "OrderCreated") {
      const orderHandler = new Contract(
        config.OrderHandler,
        OrderHandlerAbi,
        signer
      );
      res = await orderHandler.executeOrder(key, oracleParams, {
        value: updateFee, gasLimit: 10000000
      });
    }
    
    else if (event.args[1] == "WithdrawalCreated") {
      const withdrawalHandler = new Contract(
        config.WithdrawalHandler,
        WithdrawalHandlerAbi,
        signer
      );
      res = await withdrawalHandler.executeOrder(key, oracleParams, {
        value: updateFee, gasLimit: 10000000
      });
    }

    console.log(`sent tx: ${res.hash}`)
    await res.wait();
    
    console.log(`executed tx: ${res.hash}`)

    return {
      canExec: false,
      message: `executed tx: ${res.hash}`
    };
  } catch (err) {
    console.log(err)
    return {
      canExec: false,
      message: (err as Error).message,
    };
  }
});
