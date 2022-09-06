import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts";
import {
  erc20USDs,
  Transfer,
} from "../../generated/erc20USDs/erc20USDs";

import {
  l2daoUsds1PoolUSDsBalance,
  l2daoUsds1PoolUSDsBalanceDate
} from "../../generated/schema";
import {
  timestampConvertDateTime,
  digitsConvert,
  timestampConvertDate,
  collateralConvert,
} from "../utils/utils";

export function handleTransfer(event: Transfer): void {
  if (
    event.params.from.toHex() != "0x74e3a791897ca0a80b024a627710b8e7cd361b58" &&
    event.params.to.toHex() != "0x74e3a791897ca0a80b024a627710b8e7cd361b58"
  ) {
    log.debug("not L2DAO/USDs Pool address", []);
  } else {
    let entity = new l2daoUsds1PoolUSDsBalance(
      event.params.from
        .toHex()
        .concat("_")
        .concat(event.params.to.toHex())
        .concat("_")
        .concat(event.transaction.hash.toHex())
    );
    let date = new l2daoUsds1PoolUSDsBalanceDate(
      timestampConvertDate(event.block.timestamp)
    );

    entity.timeStamp = timestampConvertDateTime(event.block.timestamp);
    entity.timeStampUnix = event.block.timestamp;
    entity.blockNumber = event.block.number;
    entity.transactionHash = event.transaction.hash;
    date.timeStamp = timestampConvertDateTime(event.block.timestamp);
    date.timeStampUnix = event.block.timestamp;
    date.blockNumber = event.block.number;
    date.transactionHash = event.transaction.hash;
    // if ( event.params.from.toHex() ==
    // "0xf783dd830a4650d2a8594423f123250652340e3f")
    //   {
    //     entity.vaultCoreDAIBalanceEvent=entity.vaultCoreDAIBalanceEvent.minus(entity.value)
    //   }
    //   else{

    //   } entity.vaultCoreDAIBalanceEvent=entity.vaultCoreDAIBalanceEvent.plus(entity.value)

    let USDs = erc20USDs.bind(event.address);
    let balanceUSDs = USDs.try_balanceOf(
      Address.fromString("0x74e3a791897ca0a80b024a627710b8e7cd361b58")
    );
    if (balanceUSDs.reverted) {
      log.info("balance DAI Revert", []);
    } else {
      entity.USDsBalance = digitsConvert(balanceUSDs.value);
      date.USDsBalance = digitsConvert(balanceUSDs.value);
    }
    date.save();
    entity.save();
  }
}
