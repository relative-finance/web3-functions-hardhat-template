import { MarketProps } from "./config";
import { KyInstance } from "ky/distribution/types/ky";

export interface OracleParams {
  tokens: string[];
  providers: string[];
  data: string[];
}

export interface OracleParamsResponse {
  oracleParams: {
    tokens: string[];
    providers: string[];
    data: string[];
  };
  updateFee: string;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function decodeEventData(originalObject: any[][][][]): {
  key: string;
  market: string;
  orderType: number;
  swapPath: string[];
  longTokenSwapPath: string[];
  shortTokenSwapPath: string[];
} {
  let key = "";
  let market = "";
  let orderType = 0;
  let swapPath: string[] = [];
  let longTokenSwapPath: string[] = [];
  let shortTokenSwapPath: string[] = [];

  for (const first of originalObject) {
    for (const second of first) {
      for (const third of second) {
        if (third[0] === "key") {
          key = third[1];
        }
        if (third[0] === "market") {
          market = third[1];
        }
        if (third[0] === "orderType") {
          orderType = third[1];
        }
        if (third[0] === "key") {
          key = third[1];
        }
        if (third[0] === "swapPath") {
          swapPath = third[1];
        }
        if (third[0] === "longTokenSwapPath") {
          longTokenSwapPath = third[1];
        }
        if (third[0] === "shortTokenSwapPath") {
          shortTokenSwapPath = third[1];
        }
      }
    }
  }
  return {
    key,
    market,
    orderType,
    swapPath,
    longTokenSwapPath,
    shortTokenSwapPath,
  };
}

export async function getOracleParamsSDKBulk(
  api: KyInstance,
  marketProps: MarketProps[]
): Promise<{ oracleParams: OracleParams; updateFee: bigint }> {
  const response = await api
    .get<OracleParamsResponse>("/oracle_params", {
      searchParams: {
        marketAddresses: marketProps
          .map((value) => value.marketToken)
          .join(","),
      },
    })
    .json();

  return {
    oracleParams: response.oracleParams,
    updateFee: BigInt(response.updateFee),
  };
}
