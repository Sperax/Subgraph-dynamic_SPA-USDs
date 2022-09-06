import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts";
import {
  erc20L2DAO,
  Approval,
  Transfer,
} from "../../generated/erc20L2DAO/erc20L2DAO";
import {
  l2daoUsds1PoolL2DAOBalance,
  l2daoUsds1PoolL2DAOBalanceDate
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
    log.debug("not L2DAO/USDs pool", []);
  } else {
    let entity = new l2daoUsds1PoolL2DAOBalance(
      event.params.from
        .toHex()
        .concat("_")
        .concat(event.params.to.toHex())
        .concat("_")
        .concat(event.transaction.hash.toHex())
    );
    let date = new l2daoUsds1PoolL2DAOBalanceDate(
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

    let L2DAO = erc20L2DAO.bind(event.address);
    let balance = L2DAO.try_balanceOf(
      Address.fromString("0x74e3a791897ca0a80b024a627710b8e7cd361b58")
    );
    if (balance.reverted) {
      log.info("balance L2DAO Revert", []);
    } else {
      entity.L2DAOBalance = digitsConvert(balance.value);
      date.L2DAOBalance = digitsConvert(balance.value);
    }
    date.save();
    entity.save();
  }
}
