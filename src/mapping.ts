import { BigInt } from "@graphprotocol/graph-ts"
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
  RewardsClaimed
} from "../generated/SPA_USDs_Dynamic_Farm/SPA_USDs_Dynamic_Farm"
import { ExampleEntity } from "../generated/schema"

export function handleCooldownInitiated(event: CooldownInitiated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.account = event.params.account
  entity.tokenId = event.params.tokenId

  // Entities can be written to the store with `.save()`
  entity.save()

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

export function handleCooldownPeriodUpdated(
  event: CooldownPeriodUpdated
): void {}

export function handleDepositPaused(event: DepositPaused): void {}

export function handleDepositWithdrawn(event: DepositWithdrawn): void {}

export function handleDeposited(event: Deposited): void {}

export function handleEmergencyClaim(event: EmergencyClaim): void {}

export function handleFundsRecovered(event: FundsRecovered): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePoolUnsubscribed(event: PoolUnsubscribed): void {}

export function handleRewardRateUpdated(event: RewardRateUpdated): void {}

export function handleRewardsClaimed(event: RewardsClaimed): void {}
