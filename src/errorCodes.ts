const _errorCodes = {

  internalSystemError: 'maur/internal-system-error',
  invalidArgument: 'maur/invalid-argument',

  // authentication
  emailNotRegistered: 'maur/email-not-registered',
  authNotLinked: 'maur/auth-not-linked',
  userNotFound: 'maur/user-not-found',
  invalidActivationCode: 'maur/invalid-activation-code',
  noAuthToken: 'maur/no-auth-token',
  notAuthorized: 'maur/not-authorized',

  // signatures
  optimisticFailure: 'maur/optimistic-failure',
  signatureNameMismatch: 'maur/signature-name-mismatch',
};

export const errorCodes = _errorCodes;