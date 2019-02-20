export enum MessageTypes {
  CreateClient = 'create-client',
  TestMessage = 'test-message',
  ErrorMessage = 'error-message',
  GetTokenMessage = 'get-token',
  IamAliveMessage = 'i-am-alive'
}

export function MessageTypesArray() {
  const map: { id: number; name: string }[] = [];

  for (const n in MessageTypes) {
    if (typeof MessageTypes[n] === 'string') {
      map.push({ id: <any>MessageTypes[n], name: n });
    }
  }
  return map;
}
