import {shareholders} from "./handler_specs/shareholders_handlers";
import {Address, LegalEntity} from "./shared";

//The maximum is exclusive and the minimum is inclusive
export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

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

export function reviveDates(_key: string, value: any) {
  if (typeof value === 'string' && /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(value)) {
    return new Date(value);
  }
  return value;
}

// format date to norwegian format
export function formatDate(date: Date) {
  const day = '0' + date.getDate();
  const month = '0' + (date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day.substr(-2)}.${month.substr(-2)}.${year}`;
}

// creates new date with UTC-time set to input
export function newDate(day: number, month: number, year: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

export function todaysDate(): Date {
  let date = new Date();
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
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

function ownerToPublicShareholder(owner: LegalEntity, date: Date, shareNumbers: string): shareholders.ShareHolder {
  return {
    type: owner.type,
    email: owner.email,
    name: owner.name,
    address: owner.address!,
    idNumber: owner.idNumber,
    contactIdNumber: owner.contactIdNumber,
    contactName: owner.contactName,
    // idNumber: owner.idNumber = owner.type === EntityType.Company ?
    //   owner.idNumber : formatDate(idNumberToBirthDate(owner.idNumber)),
    numberOfShares: 0,
    listedDate: date,
    lastUpdate: date,
    shareNumbers,
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

export function shareNumbersToString(shares: number[]) {
  shares.sort((n1, n2) => n1 < n2 ? -1 : 1);
  let series = '';
  const addSeries = (from: number, to: number) => {
    if (!series) series = (from === to) ? `${from}` : `${from}-${to}`;
    else series = (from === to) ? `${series},${from}` : `${series},${from}-${to}`;
  };
  let from = shares[0];
  let previous = shares[0];
  for (let i = 1; i < shares.length; i++) {
    if (shares[i] !== previous + 1) {
      addSeries(from, previous);
      from = shares[i];
    }
    previous = shares[i];
  }
  addSeries(from, shares[shares.length - 1]);
  return series;
}

export function parseShareNumbersString(series: string) {
  const shares: number[] = [];
  const parts = series.split(',');
  for (const part of parts) {
    if (part.includes('-')) {
      const from = parseInt(part.split('-')[0]);
      const to = parseInt(part.split('-')[1]);
      for (let i = from; i <= to; i++) {
        shares.push(i);
      }
    } else {
      shares.push(parseInt(part));
    }
  }
  return shares;
}

export function removeShares(shareArray: number[], toRemove: number[]) {
  for (const remove of toRemove) {
    const index = shareArray.indexOf(remove);
    shareArray.splice(index, 1);
  }
}

// transactions is assumed to be sorted by date
export function shareHoldersFromTransactions(transactions: shareholders.ShareTransaction[],
                                             owners: LegalEntity[]): shareholders.ShareHolder[] {
  const shareHolders = new Map<string, shareholders.ShareHolder>();
  const sharesOwned = new Map<string, number[]>();
  for (const transaction of transactions) {
    let buyer = shareHolders.get(transaction.buyerIdNumber);
    if (!buyer) {
      const owner = getByIdNumber(transaction.buyerIdNumber, owners);
      if (!owner) {
        throw 'In conversion: couldnt find buyer with id ' + transaction.buyerIdNumber + ' in owner list.';
      }
      buyer = ownerToPublicShareholder(owner, transaction.transactionTime, '');
      shareHolders.set(transaction.buyerIdNumber, buyer);
    }
    buyer.numberOfShares += transaction.numberOfShares;
    buyer.lastUpdate = transaction.transactionTime;
    let shares = sharesOwned.get(transaction.buyerIdNumber);
    if (!shares) shares = [];
    shares = shares.concat(parseShareNumbersString(transaction.shareNumbers));
    sharesOwned.set(transaction.buyerIdNumber, shares);
    if (transaction.sellerIdNumber) {
      const seller = shareHolders.get(transaction.sellerIdNumber);
      if (!seller) {
        throw 'In conversion, couldnt find seller with id: ' + transaction.sellerIdNumber;
      }
      seller.numberOfShares -= transaction.numberOfShares;
      seller.lastUpdate = transaction.transactionTime;
      const sellerShares = sharesOwned.get(transaction.sellerIdNumber)!;
      const soldShares = parseShareNumbersString(transaction.shareNumbers);
      removeShares(sellerShares, soldShares);
    }
  }
  let shareholderArr = Array.from(shareHolders.values());
  shareholderArr.forEach(sh => {
    sh.shareNumbers = shareNumbersToString(sharesOwned.get(sh.idNumber)!)
  });
  return shareholderArr;
}

/* Sort transactions chronologically by transactionDate */
export function sortTransactions(transactions: shareholders.ShareTransaction[]) {
  transactions.sort((t1, t2) => t1.transactionTime > t2.transactionTime ? 1 : -1);
}

/* Sort legal entities alphabetically by name */
export function sortLegalEntities(owners: LegalEntity[]) {
  owners.sort((a, b) => a.name < b.name ? -1 : 1);
}
