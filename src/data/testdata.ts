import {LegalEntity} from "../shared";
import {EntityType} from "../enums";
import {randomInt} from "../utils";

export namespace test {
  export const hetlevik = {
    addressLine1: 'Løftet 32',
    zipCode: '5304',
    city: 'Hetlevik',
    commune: 'ASKØY',
    country: 'Norge',
  };

  export const rorvik = {
    addressLine1: 'Overgårdveien 17',
    zipCode: '7900',
    city: 'Rørvik',
    commune: 'VIKNA',
    country: 'Norge',
  };

  export const makePreben = (): LegalEntity => ({
    type: EntityType.Person,
    name: 'Preben Ludviksen',
    email: `preben${randomInt(0, 1000)}@leben.no`,
    idNumber: '05118639709',
    address: rorvik,
  });

  export const makeRuben = (): LegalEntity => ({
    type: EntityType.Person,
    name: 'Ruben Ludviksen',
    email: `ruben${randomInt(0, 1000)}@luben.no`,
    idNumber: '03028436946',
    address: hetlevik,
  });

}
