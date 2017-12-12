const _errorCodes = {

  internalSystemError: 'maur/internal-system-error',
  invalidArgument: 'maur/invalid-argument',
  networkError: 'maur/network-error',

  // authentication
  emailAlreadyInUse: 'maur/email-already-in-use',
  emailNotRegistered: 'maur/email-not-registered',
  authNotLinked: 'maur/auth-not-linked',
  userNotFound: 'maur/user-not-found',
  invalidActivationCode: 'maur/invalid-activation-code',
  authAccountLinkedToOtherUser: 'maur/auth-account-linked-to-other-user',
  noAuthToken: 'maur/no-auth-token',
  notAuthorized: 'maur/not-authorized',

  // altinn
  altinnTimeout: 'maur/altinn-timeout',
  altinnWrongSystemId: 'maur/altinn-wrong-system-id',
  altinnWrongSystemCredentials: 'maur/altinn-wrong-system-credentials',
  altinnWrongUserCredentials: 'maur/altinn-wrong-user-credentials',
  altinnWrongUser: 'maur/altinn-wrong-user',
  altinnUserBlocked: 'maur/altinn-user-blocked',
  altinnWrongSecurityLevel: 'maur/altinn-wrong-security-level',
  altinnNoMoreOneTimeCodes: 'maur/altinn-no-more-codes',
  altinnWaitingForFormTask: 'maur/altinn-waiting-for-formtask',

  // signatures
  optimisticFailure: 'maur/optimistic-failure',
  signatureNameMismatch: 'maur/signature-name-mismatch',
  alreadySigned: 'maur/already-signed',

  // shareholders
  shareholdersBookNotCreated: 'maur/shareholder-book-not-created',

  // firebase
  authRequestFailed: 'auth/network-request-failed'
};

export const errorCodes = _errorCodes;