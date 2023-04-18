import { BigInt } from "@graphprotocol/graph-ts";
import {
  SPA_USDs_Dynamic_Farm,
  CooldownInitiated,
  CooldownPeriodUpdated,
  DepositPaused,
  DepositWithdrawn,
  Deposited,
  EmergencyClaim,
  FundsRecovered,
  OwnershipTransferred,
  PoolUnsubscribed,
  RewardRateUpdated,
  RewardsClaimed,
} from "../generated/SPA_USDs_Dynamic_Farm/SPA_USDs_Dynamic_Farm";
import {
  timestampConvertDateTime,
  digitsConvert,
  timestampConvertDate,
} from "../src/utils/utils";
import {
  spausds3uniswapV3TokenLiquidity,
  spausds3uniswapV3TokenCollected,
  spausds3uniswapV3TokenRemoved,
  spausds3deposit,
  spausds3InititateCooldown,
  spausds3PeriodCoolDownUpdate,
  spausds3DepositPause,
  spausds3ClaimReward,
  spausds3unsubscribePool,
  spausds3RewardRateUpdate,
  spausds3withdraw,
  spausds3uniqueDeposit,
  spausds3uniqueWithdraw,
  spausds3EmergencyClaim,
  spausds3RecoverFund,
} from "../generated/schema";

export function handleDeposited(event: Deposited): void {
  let entity = new spausds3deposit(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let liquidity = new spausds3uniswapV3TokenLiquidity(
    event.params.tokenId.toString()
  );
  entity.tokens = liquidity.id;

  let unique = new spausds3uniqueDeposit(event.params.account.toString());

  // Entity fields can be set based on event parameters
  entity.account = event.params.account;
  entity.tokenId = event.params.tokenId;
  entity.amount = digitsConvert(event.params.liquidity); // need to be deleted on the contract event
  entity.locked = event.params.locked;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;

  unique.account = event.params.account;
  unique.tokenId = event.params.tokenId;
  unique.amount = digitsConvert(event.params.liquidity); // need to be deleted on the contract event
  unique.locked = event.params.locked;
  unique.timeStamp = timestampConvertDateTime(event.block.timestamp);
  unique.timeStampUnix = event.block.timestamp;
  unique.blockNumber = event.block.number;
  unique.transactionHash = event.transaction.hash;
  unique.gasPrice = event.transaction.gasPrice;
  unique.gasUsed = event.block.gasUsed;

  // Entities can be written to the store with `.save()`
  entity.save();
  unique.save();
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.COMMON_FUND_ID(...)
  // - contract.LOCKUP_FUND_ID(...)
  // - contract.NFPM(...)
  // - contract.PREC(...)
  // - contract.SPA(...)
  // - contract.SPAUSDsPool(...)
  // - contract.UNIV3_FACTORY(...)
  // - contract.computeRewards(...)
  // - contract.cooldownPeriod(...)
  // - contract.deposits(...)
  // - contract.emergencyReturn(...)
  // - contract.getNumDeposits(...)
  // - contract.getNumSubscriptions(...)
  // - contract.inEmergency(...)
  // - contract.isPaused(...)
  // - contract.lastFundUpdateTime(...)
  // - contract.onERC721Received(...)
  // - contract.owner(...)
  // - contract.rewardFunds(...)
  // - contract.subscriptions(...)
  // - contract.tickLowerAllowed(...)
  // - contract.tickUpperAllowed(...)
}

export function handleRewardsClaimed(event: RewardsClaimed): void {
  let entity = new spausds3ClaimReward(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(
        event.params.tokenId.toString().concat(event.params.fundId.toString())
      )
  );
  entity.account = event.params.account;
  entity.fundId = BigInt.fromI32(event.params.fundId);
  entity.fundLiquidity = event.params.fundLiquidity.toBigDecimal();
  entity.liquidity = event.params.liquidity.toBigDecimal();
  entity.rewardAmount = event.params.rewardAmount.toBigDecimal();
  entity.tokenId = event.params.tokenId;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;

  // Entities can be written to the store with `.save()`
  entity.save();
}
export function handleCooldownInitiated(event: CooldownInitiated): void {
  let entity = new spausds3InititateCooldown(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );

  entity.account = event.params.account;

  entity.expiryDateUnix = timestampConvertDate(event.params.expiryDate);
  entity.expiryDate = event.params.expiryDate;
  entity.tokenId = event.params.tokenId;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;

  // Entities can be written to the store with `.save()`
  entity.save();
}

export function handleCooldownPeriodUpdated(
  event: CooldownPeriodUpdated
): void {
  let entity = new spausds3PeriodCoolDownUpdate(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.params.oldCooldownPeriod.toString())
  );

  entity.newPeriod = event.params.newCooldownPeriod;
  entity.oldPeriod = event.params.oldCooldownPeriod;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleDepositPaused(event: DepositPaused): void {
  let entity = new spausds3DepositPause(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  entity.paused = event.params.paused;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}
export function handleDepositWithdrawn(event: DepositWithdrawn): void {
  let entity = new spausds3withdraw(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let collected = new spausds3uniswapV3TokenCollected(
    event.params.tokenId.toString()
  );
  entity.collected = collected.id;
  let decreased = new spausds3uniswapV3TokenRemoved(
    event.params.tokenId.toString()
  );
  let unique = new spausds3uniqueWithdraw(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  entity.removed = decreased.id;
  entity.account = event.params.account;
  entity.tokenId = event.params.tokenId;
  entity.startTimeUnix = event.params.startTime;
  entity.startTime = timestampConvertDateTime(event.params.startTime);
  entity.endTimeUnix = event.params.endTime;
  entity.endTime = timestampConvertDateTime(event.params.endTime);
  entity.liquidity = digitsConvert(event.params.liquidity);
  entity.totalRewardsClaimed = digitsConvert(event.params.totalRewardsClaimed);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
  unique.removed = decreased.id;
  unique.account = event.params.account;
  unique.tokenId = event.params.tokenId;
  unique.startTimeUnix = event.params.startTime;
  unique.startTime = timestampConvertDateTime(event.params.startTime);
  unique.endTimeUnix = event.params.endTime;
  unique.endTime = timestampConvertDateTime(event.params.endTime);
  unique.liquidity = digitsConvert(event.params.liquidity);
  unique.totalRewardsClaimed = digitsConvert(event.params.totalRewardsClaimed);
  unique.timeStamp = timestampConvertDateTime(event.block.timestamp);
  unique.timeStampUnix = event.block.timestamp;
  unique.blockNumber = event.block.number;
  unique.transactionHash = event.transaction.hash;
  unique.gasPrice = event.transaction.gasPrice;
  unique.gasUsed = event.block.gasUsed;
  unique.save();
}

export function handlePoolUnsubscribed(event: PoolUnsubscribed): void {
  let entity = new spausds3unsubscribePool(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  entity.account = event.params.account;
  entity.depositId = event.params.depositId;
  entity.startTimeUnix = event.params.startTime;
  entity.endTimeUnix = event.params.endTime;
  entity.startTime = timestampConvertDateTime(event.params.startTime);
  entity.endTime = timestampConvertDateTime(event.params.endTime);
  entity.fundId = BigInt.fromI32(event.params.fundId);
  entity.totalRewardsClaimed = digitsConvert(event.params.totalRewardsClaimed);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleRewardRateUpdated(event: RewardRateUpdated): void {
  let entity = new spausds3RewardRateUpdate(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  entity.fundId = BigInt.fromI32(event.params.fundId);
  entity.newRewardRate = digitsConvert(event.params.newRewardRate);
  entity.oldRewardRate = digitsConvert(event.params.oldRewardRate);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}
export function handleEmergencyClaim(event: EmergencyClaim): void {
  let entity = new spausds3EmergencyClaim(
    event.transaction.hash
      .toHex()
      .concat("_")
      .concat(event.logIndex.toString())
      .concat(event.block.number.toHex())
  );
  entity.account = event.params.account;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFundsRecovered(event: FundsRecovered): void {
  let entity = new spausds3RecoverFund(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  entity.amount = digitsConvert(event.params.amount);
  entity.account = event.params.account;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  event.params.newOwner;
  event.params.previousOwner;
}
