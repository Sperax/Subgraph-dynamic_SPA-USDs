import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import {
  NonFungiblePositionManager,

  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,

} from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import {
  uniswapV3TokenLiquidity,
} from "../generated/schema";
import { timestampConvertDateTime, digitsConvert } from "../src/utils/utils";

export function handleCollect(event: Collect): void {


}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let increase = new uniswapV3TokenLiquidity(
    event.params.tokenId.toString()
  );

   increase.tokenId=event.params.tokenId.toString()
  increase.liquidity=digitsConvert(event.params.liquidity)
  
  increase.SPA = digitsConvert(event.params.amount0)

  increase.USDs= digitsConvert(event.params.amount1)

 ;
  
  increase.save()
}

