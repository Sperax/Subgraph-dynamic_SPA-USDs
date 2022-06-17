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
  deposit,
  uniswapV3TokenLiquidity,
  InititateCooldown,
  PeriodCoolDownUpdate,
  DepositPause,
  ClaimReward,
  unsubscribePool,
  RewardRateUpdate,
  withdraw,
} from "../generated/schema";

export function handleDeposited(event: Deposited): void {
  let entity = new deposit(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.params.tokenId.toString())
  );
  let liquidity = new uniswapV3TokenLiquidity(event.params.tokenId.toString());
  entity.liquidity = liquidity.id;

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

  // Entities can be written to the store with `.save()`
  entity.save();

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
  let entity = new ClaimReward(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.params.tokenId.toString())
  );
  entity.account = event.params.account;
  entity.fundId = BigInt.fromI32(event.params.fundId);
  entity.fundLiquidity = digitsConvert(event.params.fundLiquidity);
  entity.liquidity = digitsConvert(event.params.liquidity);
  entity.rewardAmount = digitsConvert(event.params.rewardAmount);
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
  let entity = new InititateCooldown(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.params.tokenId.toString())
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
  let entity = new PeriodCoolDownUpdate(
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
  let entity = new DepositPause(event.transaction.from.toHex());
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
  let entity = new withdraw(
    event.transaction.from
      .toHex()
      .concat("_")
      .concat(event.params.tokenId.toString())
  );
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
}

export function handlePoolUnsubscribed(event: PoolUnsubscribed): void {
  let entity = new unsubscribePool(event.transaction.from.toHex());
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
  let entity = new RewardRateUpdate(event.transaction.from.toHex());
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
  event.params.account;
}

export function handleFundsRecovered(event: FundsRecovered): void {
  event.params.account;
  event.params.amount;
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  event.params.newOwner;
  event.params.previousOwner;
}
