import { BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";
import {
  NonFungiblePositionManager,
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
} from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import {
  spausds3uniswapV3TokenLiquidity,
  spausds3uniswapV3TokenCollected,
  spausds3uniswapV3TokenRemoved,
  usdsusdc3uniswapV3TokenLiquidity,
  usdsusdc3uniswapV3TokenCollected,
  usdsusdc3uniswapV3TokenRemoved,
  l2daoUsds1uniswapV3TokenLiquidity,
  l2daoUsds1uniswapV3TokenCollected,
  l2daoUsds1uniswapV3TokenRemoved,
} from "../generated/schema";
import {
  timestampConvertDateTime,
  digitsConvert,
  collateralConvert,
} from "../src/utils/utils";

export function handleCollect(event: Collect): void {
  let collectspausds3 = new spausds3uniswapV3TokenCollected(
    event.params.tokenId.toString()
  );
  let collectusdsusdc3 = new usdsusdc3uniswapV3TokenCollected(
    event.params.tokenId.toString()
  );
  let collectl2daoUsds1 = new l2daoUsds1uniswapV3TokenCollected(
    event.params.tokenId.toString()
  );
  collectspausds3.tokenId = event.params.tokenId.toString();
  collectspausds3.recipient = event.params.recipient;
  collectspausds3.SPA = digitsConvert(event.params.amount0);
  collectspausds3.USDs = digitsConvert(event.params.amount1);

  collectusdsusdc3.tokenId = event.params.tokenId.toString();
  collectusdsusdc3.recipient = event.params.recipient;
  collectusdsusdc3.USDs = digitsConvert(event.params.amount0);
  collectusdsusdc3.USDC = collateralConvert(event.params.amount1);

  collectl2daoUsds1.tokenId = event.params.tokenId.toString();
  collectl2daoUsds1.recipient = event.params.recipient;
  collectl2daoUsds1.l2DAO = digitsConvert(event.params.amount0);
  collectl2daoUsds1.USDs = digitsConvert(event.params.amount1);

  let contract = NonFungiblePositionManager.bind(event.address);
  let lpPosition = contract.try_positions(event.params.tokenId);
  if (lpPosition.reverted) {
    log.info("position reverted", []);
  } else {
    collectspausds3.fee = BigInt.fromI32(lpPosition.value.value4);
    collectusdsusdc3.fee = BigInt.fromI32(lpPosition.value.value4);
    collectl2daoUsds1.fee = BigInt.fromI32(lpPosition.value.value4);
  }

  collectspausds3.save();
  collectusdsusdc3.save();
  collectl2daoUsds1.save();
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let decreasespausds3 = new spausds3uniswapV3TokenRemoved(
    event.params.tokenId.toString()
  );
  let decreaseusdsusdc3 = new usdsusdc3uniswapV3TokenRemoved(
    event.params.tokenId.toString()
  );
  let decreasel2daoUsds1 = new l2daoUsds1uniswapV3TokenRemoved(
    event.params.tokenId.toString()
  );
  decreasespausds3.tokenId = event.params.tokenId.toString();
  decreasespausds3.liquidity = digitsConvert(event.params.liquidity);
  decreasespausds3.SPA = digitsConvert(event.params.amount0);
  decreasespausds3.USDs = digitsConvert(event.params.amount1);

  decreaseusdsusdc3.tokenId = event.params.tokenId.toString();
  decreaseusdsusdc3.liquidity = digitsConvert(event.params.liquidity);
  decreaseusdsusdc3.USDs = digitsConvert(event.params.amount0);
  decreaseusdsusdc3.USDC = collateralConvert(event.params.amount1);

  decreasel2daoUsds1.tokenId = event.params.tokenId.toString();
  decreasel2daoUsds1.liquidity = digitsConvert(event.params.liquidity);
  decreasel2daoUsds1.L2DAO = digitsConvert(event.params.amount0);
  decreasel2daoUsds1.USDs = digitsConvert(event.params.amount1);

  let contract = NonFungiblePositionManager.bind(event.address);
  let lpPosition = contract.try_positions(event.params.tokenId);
  if (lpPosition.reverted) {
    log.info("position reverted", []);
  } else {
    decreasespausds3.fee = BigInt.fromI32(lpPosition.value.value4);
    decreaseusdsusdc3.fee = BigInt.fromI32(lpPosition.value.value4);
    decreasel2daoUsds1.fee = BigInt.fromI32(lpPosition.value.value4);
  }

  decreasespausds3.save();
  decreaseusdsusdc3.save();
  decreasel2daoUsds1.save();
}
export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let increasespausds3 = new spausds3uniswapV3TokenLiquidity(
    event.params.tokenId.toString()
  );
  let increaseusdsusdc3 = new usdsusdc3uniswapV3TokenLiquidity(
    event.params.tokenId.toString()
  );
  let increasel2daoUsds1 = new l2daoUsds1uniswapV3TokenLiquidity(
    event.params.tokenId.toString()
  );
  increasespausds3.tokenId = event.params.tokenId.toString();
  increasespausds3.liquidity = digitsConvert(event.params.liquidity);
  increasespausds3.SPA = digitsConvert(event.params.amount0);
  increasespausds3.USDs = digitsConvert(event.params.amount1);

  increaseusdsusdc3.tokenId = event.params.tokenId.toString();
  increaseusdsusdc3.liquidity = digitsConvert(event.params.liquidity);
  increaseusdsusdc3.USDC = collateralConvert(event.params.amount0);
  increaseusdsusdc3.USDs = digitsConvert(event.params.amount1);

  increasel2daoUsds1.tokenId = event.params.tokenId.toString();
  increasel2daoUsds1.liquidity = digitsConvert(event.params.liquidity);
  increasel2daoUsds1.l2DAO = digitsConvert(event.params.amount0);
  increasel2daoUsds1.USDs = digitsConvert(event.params.amount1);

  let contract = NonFungiblePositionManager.bind(event.address);
  let lpPosition = contract.try_positions(event.params.tokenId);
  if (lpPosition.reverted) {
    log.info("position reverted", []);
  } else {
    increasespausds3.fee = BigInt.fromI32(lpPosition.value.value4);
    increaseusdsusdc3.fee = BigInt.fromI32(lpPosition.value.value4);
    increasel2daoUsds1.fee = BigInt.fromI32(lpPosition.value.value4);
  }
  increasespausds3.save();
  increaseusdsusdc3.save();
  increasel2daoUsds1.save();
}
