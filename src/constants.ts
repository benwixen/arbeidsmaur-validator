const _constants = {

  systemVersion: '1.0',

  boardRightToSign: {
    no: 'no',
    together: 'together',
    separately: 'separately'
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
};

export const constants = _constants;

interface ConstantMap {
  [key: string]: string;
}