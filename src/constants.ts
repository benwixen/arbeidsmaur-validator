export const constants = {

  systemVersion: '1.0',

  boardRightToSign: {
    no: 'no',
    together: 'together',
    separately: 'separately',
  } as ConstantMap,

  keyPersonellRightToSign: {
    no: 'no',
    ceo: 'ceo',
    boardHead: 'boardHead',
    ceoAndBoardHeadTogether: 'ceoAndBoardHeadTogether',
    ceoAndBoardHeadSeparately: 'ceoAndBoardHeadSeparately',
  } as ConstantMap,

  bankLogonPreference: {
    bankid: 'bankid',
    kodebrikke: 'kodebrikke',
  },

  vingerSteps: ['navn', 'aktivitet', 'eiere', 'ledere', 'adresse', 'vedtekter', 'regnskap', 'bank', 'oppsummering'],
  vingerStepNames: ['Firmanavn', 'Aktivitet', 'Aksjer og eiere', 'Styre og daglig leder', 'Adresse', 'Vedtekter',
    'Regnskapsfører', 'Bankdetaljer'],
};

interface ConstantMap {
  [key: string]: string;
}
