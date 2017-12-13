import {EntityType} from '../enums';
import {LegalEntity} from '../shared';
import {randomInt} from '../utils';

// tslint:disable-next-line
export class test {
  public static hetlevik = {
    addressLine1: 'Løftet 32',
    zipCode: '5304',
    city: 'Hetlevik',
    commune: 'ASKØY',
    country: 'Norge',
  };

  public static rorvik = {
    addressLine1: 'Overgårdveien 17',
    zipCode: '7900',
    city: 'Rørvik',
    commune: 'VIKNA',
    country: 'Norge',
  };

  public static strusshamn = {
    addressLine1: 'Svebrotet 41',
    zipCode: '5302',
    city: 'Strusshamn',
    commune: 'ASKØY',
    country: 'Norge',
  };

  public static makePreben = (): LegalEntity => ({
    type: EntityType.Person,
    name: 'Preben Ludviksen',
    email: `preben${randomInt(0, 1000)}@leben.no`,
    idNumber: '05118639709',
    address: test.rorvik,
  })

  public static makeRuben = (): LegalEntity => ({
    type: EntityType.Person,
    name: 'Ruben Ludviksen',
    email: `ruben${randomInt(0, 1000)}@luben.no`,
    idNumber: '03028436946',
    address: test.hetlevik,
  })

  public static makeLaConsulting = (): LegalEntity => ({
    type: EntityType.Company,
    name: 'LA Consulting AS',
    email: `la_${randomInt(0, 1000)}@consulting.no`,
    idNumber: '998391946',
    address: test.strusshamn,
    contactName: 'Leif Andreas Ludviksen',
    contactIdNumber: '09076043725',
  })
}
