export enum EntityType {
  Person = 1,
  Company = 2,
}

export enum FirstRefusalType { // forkjøpsrett
  None = 'none',
  SamePrice = 'samePrice',
  Standard = 'standard',
  Custom = 'custom',
}

export enum BoardRole {
  Styreleder = 'Styreleder',
}

export enum MeetingType {
  Board = 'board',
  AnnualMeeting = 'ordingGeneralForsamling',
  ExtraMeeting = 'ekstraOrdGeneralForsamling',
}

export enum MeetingItemType { // for saker i generalforsamling
  Ordinary = 'ordinary',
  Statutes = 'statutes',
  DividendRights = 'dividendRights',
  OwnerRights = 'ownerRights'
}