import MeetingVoteAttributes = board.MeetingVoteAttributes;
import {BoardRole, EntityType, MeetingItemType} from './enums';
import {board} from './handler_specs/board_handlers';
import MeetingAttendanceAttributes = board.MeetingAttendanceAttributes;
import {vinger} from './handler_specs/vinger_handlers';
import {Address, LegalEntity} from './shared';
import FounderAttributes = vinger.FounderAttributes;

// The maximum is exclusive and the minimum is inclusive
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
export function newDate(day: number, month: number, year: number, hour?: number, minute?: number) {
  if (hour && minute) {
    return new Date(Date.UTC(year, month - 1, day, hour, minute));
  } else {
    return new Date(Date.UTC(year, month - 1, day));
  }
}

export function todaysUtcDate(): Date {
  const date = new Date();
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function todaysDate(): Date {
  const date = new Date();
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

interface HasIdNumber {
  idNumber: string
}

export function getByIdNumber<T extends HasIdNumber>(idNumber: string, owners: T[]) {
  for (const owner of owners) {
    if (owner.idNumber === idNumber) return owner;
  }
}

export function getIndexByIdNumber(idNumber: string, owners: HasIdNumber[]) {
  for (let i = 0 ; i < owners.length; i++) {
    const owner = owners[i];
    if (owner.idNumber === idNumber) return i;
  }
  return -1;
}

export function toLegalEntity(entity: LegalEntity): LegalEntity {
  return {
    id: entity.id,
    type: entity.type,
    idNumber: entity.idNumber,
    name: entity.name,
    email: entity.email,
    phoneNumber: entity.phoneNumber,
    address: entity.address,
    contactName: entity.contactName,
    contactIdNumber: entity.contactIdNumber,
  };
}

export function countVotes(
  votees: MeetingAttendanceAttributes[],
  votes: MeetingVoteAttributes[],
  meetingChairId: number,
  itemType: MeetingItemType,
) {
  const voteMap = new Map<number, boolean|undefined>();
  votes.forEach(v => voteMap.set(v.connectedEntityId, v.vote));
  let yesVotes = 0, noVotes = 0, totalVotes = 0;
  for (const votee of votees) {
    const numVotes = votee.sharesAtTime ? votee.sharesAtTime : 1;
    totalVotes += numVotes;
    const vote = voteMap.get(votee.connectedEntityId!);
    if (vote) {
      yesVotes += numVotes;
    } else if (vote === false) {
      noVotes += numVotes;
    }
  }
  const votesGiven = yesVotes + noVotes;
  let votesNeeded = votesGiven / 2.0;
  if (itemType === MeetingItemType.Statutes) {
    votesNeeded = votesGiven * (2.0 / 3.0);
  } else if (itemType === MeetingItemType.DividendRights) {
    votesNeeded = votesGiven * (9.0 / 10.0);
  }
  let verdict = 'Ikke vedtatt.';
  if (yesVotes === totalVotes) {
    verdict = 'Enstemmig vedtatt.';
  } else if (itemType === MeetingItemType.OwnerRights) {
    verdict = 'Ikke vedtatt, på grunn av krav om enstemmighet.';
  } else if (yesVotes > votesNeeded) {
    verdict = 'Vedtatt.';
  } else if (yesVotes === votesNeeded && itemType === MeetingItemType.DividendRights) {
    verdict = 'Vedtatt.';
  } else if (yesVotes === votesNeeded && voteMap.get(meetingChairId)) {
    verdict = 'Vedtatt pga. møteleders stemme.';
  } else if (itemType === MeetingItemType.DividendRights) {
    verdict = 'Ikke vedtatt, på grunn av krav om kvalifisert flertall.';
  } else if (itemType === MeetingItemType.Statutes) {
    verdict = 'Ikke vedtatt, på grunn av krav om 2/3 flertall for vedtektsendringer.';
  }
  return {
    yesVotes,
    noVotes,
    votesGiven,
    totalVotes,
    verdict,
  };
}

/* Sort legal entities alphabetically by name */
export function sortLegalEntities(owners: LegalEntity[]) {
  owners.sort((a, b) => a.name < b.name ? -1 : 1);
}

export function boardRoleName(role?: BoardRole) {
  switch (role) {
    case BoardRole.Chairman:
      return 'Styreleder';
    case BoardRole.DeputyChair:
      return 'Nestleder';
    case BoardRole.Member:
      return 'Styremedlem';
    case BoardRole.AlternateMember:
      return 'Varamedlem';
    case BoardRole.Ceo:
      return 'Daglig leder';
    default:
      throw new Error(`Unknown board role: ${role}`);
  }
}

export function hasMotherCompany(founders: FounderAttributes[], entityMap: Map<string, LegalEntity>,
  numberOfShares: number): boolean|undefined {

  let companyShares = 0;
  for (const founderProps of founders) {
    const entity = entityMap.get(founderProps.idNumber)!;
    if (entity.type === EntityType.Company) {
      if (founderProps.numberOfShares / numberOfShares > 0.5) {
        return true;
      }
      companyShares += founderProps.numberOfShares;
    }
  }
  const companyShare = companyShares / numberOfShares;
  if (companyShare <= 0.5) {
    return false;
  }
}
