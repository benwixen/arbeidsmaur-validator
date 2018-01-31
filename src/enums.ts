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
  Chairman = 'chairman',
  DeputyChair = 'deputyChair',
  Member = 'member',
  AlternateMember = 'alternateMember',

  Ceo = 'ceo', // if not board member, but attending board meeting
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
  OwnerRights = 'ownerRights',
}

export enum MeetingRole {
  Shareholder = 'shareholder',
  MeetingLeader = 'meetingLeader',

  Chairman = 'chairman',
  DeputyChair = 'deputyChair',
  Member = 'member',
  AlternateMember = 'alternateMember',
  Ceo = 'ceo',
}

export enum DocumentType {
  Stiftdok = 'stiftdok',
  StiftdokPaper = 'stiftdokPaper',
  Styreprotokoll = 'styreprotokoll',
  Generalprotokoll = 'generalprotokoll',
  EkstraOrdProtokoll = 'ekstraordprotokoll',
  Aksjebevis = 'aksjebevis',
  Bankbekreftelse = 'bankbekreftelse',
  SamordnetRegMelding = 'samordnetRegMeld',
}

export enum CompanyRole { // for users
  Leader = 'leader', // ceo OR board member
  OnBoard = 'onBoard', // board member
  Ceo = 'ceo',
  Chairman = 'chairman',
}

export enum PaymentType {
  Invoice = 'invoice',
  Card = 'card',
}

export enum PaymentTerm {
  Yearly = 'yearly',
  Monthly = 'monthly',
}

export enum CardStatus {
  Paused = 'paused',
  Active = 'active',
}

export enum OrganizationForm {
  Aksjeselskap = 'AS',
  Enkeltpersonforetak = 'ENK',
}
