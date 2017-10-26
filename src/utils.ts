import {shareholders} from "./handler_specs/shareholders_handlers";
import {Address, LegalEntity} from "./shared";

export const formatMoney = (summy: number) => {
  const sum = summy.toString();
  if (sum.length > 6) {
    const cutPoint1 = sum.length - 6;
    const cutPoint2 = sum.length - 3;
    return `${sum.substring(0, cutPoint1)} ${sum.substring(cutPoint1, cutPoint2)} ${sum.substring(cutPoint2)} kr`;
  } else if (sum.length > 3) {
    const cutPoint = sum.length - 3;
    return `${sum.substring(0, cutPoint)} ${sum.substring(cutPoint)} kr`;
  } else {
    return sum + ' kr';
  }
};

// format date to norwegian format
export function formatDate(date: Date) {
  const day = '0' + date.getDate();
  const month = '0' + (date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day.substr(-2)}.${month.substr(-2)}.${year}`;
}

export function newDate(day: number, month: number, year: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatAddress(address: Address) {
  let formatted = `${address.addressLine1}, ${address.zipCode} ${address.city}`;
  if (address.country !== 'Norge') {
    formatted += ` ${address.country}`;
  }
  return formatted;
}

export function idNumberToBirthDate(idNumber: string) {
  const day = idNumber.substring(0, 2);
  const month = idNumber.substring(2, 4);
  let year = idNumber.substring(4, 6);
  year = (parseInt(year) < 10) ? `20${year}` : `19${year}`;
  return newDate(parseInt(day), parseInt(month), parseInt(year));
}

function ownerToPublicShareholder(owner: LegalEntity, date: Date): shareholders.ShareHolder {
  return {
    type: owner.type,
    email: owner.email,
    name: owner.name,
    address: owner.address,
    idNumber: owner.idNumber,
    contactIdNumber: owner.contactIdNumber,
    contactName: owner.contactName,
    // idNumber: owner.idNumber = owner.type === EntityType.Company ?
    //   owner.idNumber : formatDate(idNumberToBirthDate(owner.idNumber)),
    numberOfShares: 0,
    listedDate: date,
    lastUpdate: date,
  };
}

interface HasIdNumber {
  idNumber: string
}

export function getByIdNumber<T extends HasIdNumber>(idNumber: string, owners: T[]) {
  for (const owner of owners) {
    if (owner.idNumber === idNumber) return owner;
  }
}

export function getIndexByIdNumber(idNumber: string, owners: HasIdNumber[]) {
  for (let i = 0 ; i< owners.length; i++) {
    const owner = owners[i];
    if (owner.idNumber === idNumber) return i;
  }
  return -1;
}

export function toLegalEntity(entity: LegalEntity): LegalEntity {
  return {
    type: entity.type,
    idNumber: entity.idNumber,
    name: entity.name,
    email: entity.email,
    address: entity.address,
    contactName: entity.contactName,
    contactIdNumber: entity.contactIdNumber,
  }
}

// transactions is assumed to be sorted by date
export function shareHoldersFromTransactions(transactions: shareholders.ShareTransaction[],
                                             owners: LegalEntity[]): shareholders.ShareHolder[] {
  const shareHolders: { [index:string]: shareholders.ShareHolder } = {};
  for (const transaction of transactions) {
    let buyer = shareHolders[transaction.buyerIdNumber];
    if (!buyer) {
      const owner = getByIdNumber(transaction.buyerIdNumber, owners);
      if (!owner) {
        console.log('owners:');
        console.log(owners);
        throw 'In conversion: couldnt find buyer with id ' + transaction.buyerIdNumber + ' in owner list.';
      }
      buyer = ownerToPublicShareholder(owner, transaction.transactionDate);
      shareHolders[transaction.buyerIdNumber] = buyer;
    }
    buyer.numberOfShares += transaction.numberOfShares;
    buyer.lastUpdate = transaction.transactionDate;
    if (transaction.sellerIdNumber) {
      const seller = shareHolders[transaction.sellerIdNumber];
      if (!seller) {
        throw 'Couldnt find seller with id: ' + transaction.sellerIdNumber;
      }
      seller.numberOfShares -= transaction.numberOfShares;
      seller.lastUpdate = transaction.transactionDate;
    }
  }
  return Object.values(shareHolders);
}