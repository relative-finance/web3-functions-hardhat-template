import { AddressZero } from "@ethersproject/constants";
import { EvmPriceServiceConnection, HexString } from "@pythnetwork/pyth-evm-js";
import { Buffer } from "buffer";
import { BigNumber, Contract } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { MarketProps, feedIdCache, baseFeedIdCache, config} from "./config"

export interface OracleParams {
    tokens: string[];
    providers: string[];
    data: string[];
}

export function decodeEventData(originalObject: any[][][][]): {
    key: string;
    market: string;
    orderType: number;
    swapPath: string[];
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
} {
    let key: string = '';
    let market: string = '';
    let orderType: number = 0;
    let swapPath: string[] = [];
    let longTokenSwapPath: string[] = [];
    let shortTokenSwapPath: string[] = [];

    for (const first of originalObject){
        for (const second of first){
            for(const third of second){
                if (third[0] === 'key') {
                    key = third[1];
                }
                if (third[0] === 'market') {
                    market = third[1];
                }
                if (third[0] === 'orderType') {
                    orderType = third[1];
                }
                if (third[0] === 'key') {
                    key = third[1];
                }
                if (third[0] === 'swapPath') {
                    swapPath = third[1];
                }
                if (third[0] === 'longTokenSwapPath') {
                    longTokenSwapPath = third[1];
                }
                if (third[0] === 'shortTokenSwapPath') {
                    shortTokenSwapPath = third[1];
                }
            }
        }
    }
    return { key, market, orderType, swapPath, longTokenSwapPath, shortTokenSwapPath };
}

export function base64ToHex(data: string): HexString {
  return "0x" + Buffer.from(data, "base64").toString("hex");
}

export async function getOracleParams(marketProps: MarketProps[], timestamp: number, pythContract: Contract, hermesEndpoint: string): Promise<{ oracleParams: OracleParams, updateFee: BigNumber}> {
    let feedIds = new Set<string>();
    let addressToFeedId: Record<string, string> = {};
    let addressToBaseFeedId: Record<string, string> = {};

    for(let i=0; i<marketProps.length;i++){
        const marketProp = marketProps[i];
        if (marketProp.indexToken !== AddressZero) {
            const indexTokenFeedId = feedIdCache[marketProp.indexToken];
            feedIds.add(indexTokenFeedId);
            addressToFeedId[marketProp.indexToken] = indexTokenFeedId;

            const indexTokenBaseFeedId = baseFeedIdCache[marketProp.indexToken];
            if(indexTokenBaseFeedId !== undefined){
                feedIds.add(indexTokenBaseFeedId);
                addressToBaseFeedId[marketProp.indexToken] = indexTokenBaseFeedId;
            }
        }

        if (marketProp.longToken !== AddressZero) {
            const longTokenFeedId = feedIdCache[marketProp.longToken];
            feedIds.add(longTokenFeedId);
            addressToFeedId[marketProp.longToken] = longTokenFeedId;
        }

        if (marketProp.shortToken !== AddressZero) {
            const shortTokenFeedId = feedIdCache[marketProp.shortToken];
            feedIds.add(shortTokenFeedId);
            addressToFeedId[marketProp.shortToken] = shortTokenFeedId;
        }
    }

    const connection = new EvmPriceServiceConnection(hermesEndpoint);

    const feedIdsArray = Array.from(feedIds.values());

    const priceData = (
        await Promise.all(feedIdsArray.map(feedId => connection.getVaa(feedId, timestamp)))
    ).map(([data, _]) => {
        return base64ToHex(data)
    });

    let feedIdToData: Record<string, string> = {};
    for (let i = 0; i < feedIdsArray.length; i++){
        feedIdToData[feedIdsArray[i]] = priceData[i];
    }

    const updateFee = await pythContract.getUpdateFee(priceData);

    let tokens: string[] = [];
    let data: string[] = [];

    for(const address in addressToFeedId){
        tokens.push(address);
        if(addressToBaseFeedId[address]){
            const d1 = feedIdToData[addressToFeedId[address]];
            const d2 = feedIdToData[addressToBaseFeedId[address]];
            data.push(defaultAbiCoder.encode(["bytes", "bytes"], [d1, d2]));
        } else {
            data.push(feedIdToData[addressToFeedId[address]]);
        }
    }

    const oracleParams: OracleParams = {
        tokens: tokens,
        providers: tokens.map((x)=>{
          return config.PythDataStreamProvider
        }),
        data: data,
    };

    return {oracleParams: oracleParams, updateFee: updateFee};
}
