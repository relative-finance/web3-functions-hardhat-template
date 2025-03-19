import { Interface } from "@ethersproject/abi";
import {
  Web3Function,
  Web3FunctionEventContext,
} from "@gelatonetwork/web3-functions-sdk";
import EventEmitterAbi from "./abis/EventEmitter.json";
import OrderHandlerAbi from "./abis/OrderHandler.json";
import DepositHandlerAbi from "./abis/DepositHandler.json";
import WithdrawalHandlerAbi from "./abis/WithdrawalHandler.json";
import { decodeEventData, getOracleParamsSDKBulk, sleep } from "./utils";
import { MarketProps, marketProps, config } from "./config";
import { Contract } from "ethers";
import { KyInstance } from "ky/distribution/types/ky";
import ky from "ky";

let SDK_API: KyInstance;
import createLogger from "./logger";
import winston from "winston";

let logger: winston.Logger;

Web3Function.onRun(async (context: Web3FunctionEventContext) => {
  const { log, multiChainProvider } = context;

  console.log(log);
  SDK_API = ky.create({
    prefixUrl: "https://ccgv6da97e.execute-api.us-east-1.amazonaws.com", // Mainnet URL
    // prefixUrl: "https://i3t32kr8e2.execute-api.us-east-1.amazonaws.com", // Internal URL
  });
  const DD_API_KEY = await secrets.get("DD_API_KEY");
  logger = createLogger(DD_API_KEY);

  try {
    // Parse the event from the log using the provided event ABI
    logger.log("info", "parsing event");
    const contractInterface = new Interface(EventEmitterAbi);
    const event = contractInterface.parseLog(log);

    if (
      event.args[1] != "DepositCreated" &&
      event.args[1] != "OrderCreated" &&
      event.args[1] != "WithdrawalCreated"
    ) {
      logger.log("info", `event found: ${event.args[1]}, ignoring`);
      return {
        canExec: false,
        message: `event found: ${event.args[1]}, ignoring`,
      };
    }

    logger.log("info", `event found: ${event.args[1]}`);
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
      logger.log("info", `order type found: ${orderType}, ignoring`);
      return {
        canExec: false,
        message: `order type found: ${orderType}, ignoring`,
      };
    }

    logger.log("info", `order tx: ${log.transactionHash}`);

    // sleep 2 seconds to reduce chances of w3f passing simulation when other automation executes the item
    await sleep(2 * 1000);

    const props: MarketProps[] = [];
    props.push(marketProps[market]);

    for (let i = 0; i < longTokenSwapPath.length; i++) {
      props.push(marketProps[longTokenSwapPath[i]]);
    }
    for (let i = 0; i < shortTokenSwapPath.length; i++) {
      props.push(marketProps[shortTokenSwapPath[i]]);
    }
    for (let i = 0; i < swapPath.length; i++) {
      props.push(marketProps[swapPath[i]]);
    }

    const provider = multiChainProvider.default();

    const { oracleParams, updateFee } = await getOracleParamsSDKBulk(
      SDK_API,
      props
    );

    if (event.args[1] == "DepositCreated") {
      const depositHandler = new Contract(
        config.DepositHandler,
        DepositHandlerAbi,
        provider
      );
      return {
        canExec: true,
        callData: [
          {
            to: depositHandler.address,
            data: depositHandler.interface.encodeFunctionData(
              "executeDeposit",
              [key, oracleParams]
            ),
            value: updateFee.toString(),
          },
        ],
      };
    } else if (event.args[1] == "OrderCreated") {
      const orderHandler = new Contract(
        config.OrderHandler,
        OrderHandlerAbi,
        provider
      );
      return {
        canExec: true,
        callData: [
          {
            to: orderHandler.address,
            data: orderHandler.interface.encodeFunctionData("executeOrder", [
              key,
              oracleParams,
            ]),
            value: updateFee.toString(),
          },
        ],
      };
    } else if (event.args[1] == "WithdrawalCreated") {
      const withdrawalHandler = new Contract(
        config.WithdrawalHandler,
        WithdrawalHandlerAbi,
        provider
      );
      return {
        canExec: true,
        callData: [
          {
            to: withdrawalHandler.address,
            data: withdrawalHandler.interface.encodeFunctionData(
              "executeWithdrawal",
              [key, oracleParams]
            ),
            value: updateFee.toString(),
          },
        ],
      };
    }

    return {
      canExec: false,
      message: `no match: ${event.args[1]}`,
    };
  } catch (err) {
    logger.log("error", String(err));
    return {
      canExec: false,
      message: (err as Error).message,
    };
  }
});
