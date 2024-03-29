import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts";
import {
  l2daoUsdsFarm,
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
} from "../generated/l2daoUsdsFarm/l2daoUsdsFarm";
import {
  timestampConvertDateTime,
  digitsConvert,
  timestampConvertDate,
} from "../src/utils/utils";
import {
  l2daoUsds1uniswapV3TokenLiquidity,
  l2daoUsds1uniswapV3TokenCollected,
  l2daoUsds1uniswapV3TokenRemoved,
  l2daoUsds1deposit,
  l2daoUsds1InititateCooldown,
  l2daoUsds1PeriodCoolDownUpdate,
  l2daoUsds1DepositPause,
  l2daoUsds1ClaimReward,
  l2daoUsds1unsubscribePool,
  l2daoUsds1RewardRateUpdate,
  l2daoUsds1withdraw,
  l2daoUsds1RecoveredFund,
  l2daoUsds1RewardBalance,
} from "../generated/schema";

export function handleDeposited(event: Deposited): void {
  let entity = new l2daoUsds1deposit(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );

  let liquidity = new l2daoUsds1uniswapV3TokenLiquidity(
    event.params.tokenId.toString()
  );
  let rewardsBalance = new l2daoUsds1RewardBalance(
     event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let contract = l2daoUsdsFarm.bind(event.address);
  let l2daoReward = contract.try_getRewardBalance(
    Address.fromString("0x2cab3abfc1670d1a452df502e216a66883cdf079")
  );
  if (l2daoReward.reverted) {
    log.info("balance reverted", []);
  } else {
    rewardsBalance.L2DAORewardBalance = digitsConvert(l2daoReward.value);
  }

  let spaReward = contract.try_getRewardBalance(
    Address.fromString("0x5575552988A3A80504bBaeB1311674fCFd40aD4B")
  );
  if (spaReward.reverted) {
    log.info("balance reverted", []);
  } else {
    rewardsBalance.SPARewardBalance = digitsConvert(spaReward.value);
  }

  rewardsBalance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  rewardsBalance.timeStampUnix = event.block.timestamp;
  rewardsBalance.blockNumber = event.block.number;
  rewardsBalance.transactionHash = event.transaction.hash;
  rewardsBalance.save();

  entity.tokens = liquidity.id;
  entity.account = event.params.account;
  entity.tokenId = event.params.tokenId;
  entity.liquidity = digitsConvert(event.params.liquidity); // need to be deleted on the contract event
  entity.locked = event.params.locked;

  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleDepositWithdrawn(event: DepositWithdrawn): void {
  let entity = new l2daoUsds1withdraw(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let collected = new l2daoUsds1uniswapV3TokenCollected(
    event.params.tokenId.toString()
  );
  entity.collected = collected.id;
  let decreased = new l2daoUsds1uniswapV3TokenRemoved(
    event.params.tokenId.toString()
  );
  let rewardsBalance = new l2daoUsds1RewardBalance(
     event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let contract = l2daoUsdsFarm.bind(event.address);
  let l2daoReward = contract.try_getRewardBalance(
    Address.fromString("0x2cab3abfc1670d1a452df502e216a66883cdf079")
  );
  if (l2daoReward.reverted) {
    log.info("balance reverted", []);
  } else {
    rewardsBalance.L2DAORewardBalance = digitsConvert(l2daoReward.value);
  }

  let spaReward = contract.try_getRewardBalance(
    Address.fromString("0x5575552988A3A80504bBaeB1311674fCFd40aD4B")
  );
  if (spaReward.reverted) {
    log.info("balance reverted", []);
  } else {
    rewardsBalance.SPARewardBalance = digitsConvert(spaReward.value);
  }

  rewardsBalance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  rewardsBalance.timeStampUnix = event.block.timestamp;
  rewardsBalance.blockNumber = event.block.number;
  rewardsBalance.transactionHash = event.transaction.hash;
  rewardsBalance.save();

  entity.removed = decreased.id;
  entity.account = event.params.account;
  entity.tokenId = event.params.tokenId;
  entity.startTimeUnix = event.params.startTime;
  entity.startTime = timestampConvertDateTime(event.params.startTime);
  entity.endTimeUnix = event.params.endTime;
  entity.endTime = timestampConvertDateTime(event.params.endTime);
  entity.liquidity = digitsConvert(event.params.liquidity);
  entity.l2daoRewardsClaimed = digitsConvert(
    event.params.totalRewardsClaimed[0]
  );
  entity.spaRewardsClaimed = digitsConvert(event.params.totalRewardsClaimed[1]);
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleCooldownInitiated(event: CooldownInitiated): void {
  let entity = new l2daoUsds1InititateCooldown(
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
  let entity = new l2daoUsds1PeriodCoolDownUpdate(
 event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
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
  let entity = new l2daoUsds1DepositPause( event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString()));
  entity.paused = event.params.paused;
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
  let entity = new l2daoUsds1RecoveredFund( event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString()));
  entity.account = event.params.account;
  entity.amount = digitsConvert(event.params.amount);
  entity.rewardToken = event.params.rwdToken;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePoolUnsubscribed(event: PoolUnsubscribed): void {
  let entity = new l2daoUsds1unsubscribePool( event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString()));
  entity.account = event.params.account;
  entity.depositId = event.params.depositId;
  entity.startTimeUnix = event.params.startTime;
  entity.endTimeUnix = event.params.endTime;
  entity.startTime = timestampConvertDateTime(event.params.startTime);
  entity.endTime = timestampConvertDateTime(event.params.endTime);
  entity.fundId = BigInt.fromI32(event.params.fundId);
  entity.totalL2daoRewardsClaimed = digitsConvert(
    event.params.totalRewardsClaimed[0]
  );
  entity.totalSpaRewardsClaimed = digitsConvert(
    event.params.totalRewardsClaimed[1]
  );
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleRewardRateUpdated(event: RewardRateUpdated): void {
  let entity = new l2daoUsds1RewardRateUpdate( event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString()));
  entity.rewardToken = event.params.rewardToken;

  // entity.newL2daoRewardRate = digitsConvert(event.params.newRewardRate[1]);
  // entity.newSpaRewardRate = digitsConvert(event.params.newRewardRate[2]);
  // entity.oldL2daoRewardRate = digitsConvert(event.params.oldRewardRate[1]);
  // entity.oldSpaRewardRate = digitsConvert(event.params.oldRewardRate[2]);
  entity.oldRewardRate = event.params.oldRewardRate;
  entity.newRewardRate = event.params.newRewardRate;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;
  entity.save();
}

export function handleRewardsClaimed(event: RewardsClaimed): void {
  let entity = new l2daoUsds1ClaimReward(
    event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let rewardsBalance = new l2daoUsds1RewardBalance(
     event.transaction.hash.toHex().concat("_").concat(event.logIndex.toString())
  );
  let contract = l2daoUsdsFarm.bind(event.address);
  let l2daoReward = contract.try_getRewardBalance(
    Address.fromString("0x2cab3abfc1670d1a452df502e216a66883cdf079")
  );
  if (l2daoReward.reverted) {
    log.info("balance reverted", []);
  } else {
    rewardsBalance.L2DAORewardBalance = digitsConvert(l2daoReward.value);
  }

  let spaReward = contract.try_getRewardBalance(
    Address.fromString("0x5575552988A3A80504bBaeB1311674fCFd40aD4B")
  );
  if (spaReward.reverted) {
    log.info("balance reverted", []);
  } else {
    rewardsBalance.SPARewardBalance = digitsConvert(spaReward.value);
  }

  rewardsBalance.timeStamp = timestampConvertDateTime(event.block.timestamp);
  rewardsBalance.timeStampUnix = event.block.timestamp;
  rewardsBalance.blockNumber = event.block.number;
  rewardsBalance.transactionHash = event.transaction.hash;
  rewardsBalance.save();
  entity.account = event.params.account;
  entity.fundId = BigInt.fromI32(event.params.fundId);
  entity.fundLiquidity = digitsConvert(event.params.fundLiquidity);
  entity.liquidity = digitsConvert(event.params.liquidity);
  entity.l2daoRewardAmount = digitsConvert(event.params.rewardAmount[0]);
  entity.spaRewardAmount = digitsConvert(event.params.rewardAmount[1]);
  entity.tokenId = event.params.tokenId;
  entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
  entity.timeStampUnix = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasUsed = event.block.gasUsed;

  entity.save();
}
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
// - contract.MAX_NUM_REWARDS(...)
// - contract.MIN_COOLDOWN_PERIOD(...)
// - contract.NFPM(...)
// - contract.PREC(...)
// - contract.UNIV3_FACTORY(...)
// - contract._getAccRewards(...)
// - contract._getLiquidity(...)
// - contract.computeRewards(...)
// - contract.cooldownPeriod(...)
// - contract.deposits(...)
// - contract.farmStartTime(...)
// - contract.getDeposit(...)
// - contract.getNumDeposits(...)
// - contract.getNumSubscriptions(...)
// - contract.getRewardBalance(...)
// - contract.getRewardFundInfo(...)
// - contract.getRewardRates(...)
// - contract.getSubscriptionInfo(...)
// - contract.inEmergency(...)
// - contract.isPaused(...)
// - contract.lastFundUpdateTime(...)
// - contract.onERC721Received(...)
// - contract.owner(...)
// - contract.rewardData(...)
// - contract.rewardFunds(...)
// - contract.rewardTokens(...)
// - contract.subscriptions(...)
// - contract.tickLowerAllowed(...)
// - contract.tickUpperAllowed(...)
// - contract.uniswapPool(...)
