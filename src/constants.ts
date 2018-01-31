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

  skoleStopSteps: ['selskapsform', 'navn', 'eiere', 'ledere', 'adresse', 'regnskap', 'oppsummering'],
};

interface ConstantMap {
  [key: string]: string;
}
