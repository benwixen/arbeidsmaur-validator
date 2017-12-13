import {constants} from '../constants';
import {counties, countries} from '../data/countries';
import BoardMemberAttributes = board.BoardMemberAttributes;
import {BoardRole, EntityType} from '../enums';
import {board} from '../handler_specs/board_handlers';
import {vinger} from '../handler_specs/vinger_handlers';
import StartCompanyRequest = vinger.StartCompanyRequest;
import {Address, LegalEntity} from '../shared';
import FounderAttributes = vinger.FounderAttributes;

function throwError(message: string, description?: string) {
  const desc = description ? `${description}: ` : '';
  throw new Error(`${desc}${message}`);
}

export class CompanyValidator {

  public static validateCompanyForm(companyForm: StartCompanyRequest) {
    CompanyValidator.validateLegalEntities(companyForm.entities);
    const entityMap = new Map<string, LegalEntity>();
    companyForm.entities.forEach(e => entityMap.set(e.idNumber, e));
    CompanyValidator.validateCompanyCapital(companyForm.shares.totalCapital);
    CompanyValidator.validateContactPerson(companyForm.contactPersonIdNumber, companyForm.entities);
    if (!companyForm.contactPersonIdNumber) throw new Error('Mangler fødselsnummer til kontaktperson.');
    CompanyValidator.validateCompanyName(companyForm.name);
    if (!companyForm.businessAddress) throw new Error('Mangler forretningsadresse.');
    CompanyValidator.validateAddress(companyForm.businessAddress, 'Forretningsadresse');

    CompanyValidator.validateFounders(companyForm);
    CompanyValidator.validateBoard(companyForm.board, companyForm.entities);
    CompanyValidator.validateVingerForm(companyForm, entityMap);
    const chairman = companyForm.board.find(member => member.role === BoardRole.Chairman)!;
    const ceoIdNumber = companyForm.vingerForm.ceoIdNumber;
    const contactIdNumber = companyForm.contactPersonIdNumber;
    if (!(contactIdNumber === chairman.idNumber || contactIdNumber === ceoIdNumber)) {
      throw new Error('Kontaktperson (du) må være styreleder eller daglig leder.');
    }
  }

  public static validateContactPerson(idNumber: string, entities: LegalEntity[]) {
    if (!idNumber) throw new Error('Mangler fødselsnummer på kontaktperson.');
    const index = entities.findIndex(e => e.idNumber === idNumber);
    if (index === -1) {
      throw new Error('Fant ikke data for kontaktperson.');
    }
  }

  public static validateLegalEntities(entities: LegalEntity[]) {
    for (const entity of entities) {
      CompanyValidator.validateLegalEntity(entity);
    }
  }

  public static validateLegalEntity(entity: LegalEntity) {
    if (!entity.type) throw new Error('Mangler type for person/selskap.');
    CompanyValidator.validateEntityName(entity.name);
    CompanyValidator.validateEmail(entity.email);
    if (!entity.idNumber) throw new Error('Mangler personnummer/org-nummer for: ' + entity.name);
    CompanyValidator.validateIdNumber(entity.idNumber, entity.name);
    if (CompanyValidator.isIdNumberCompany(entity.idNumber)) {
      if (!entity.contactName) throw new Error('Mangler kontaktperson for selskap: ' + entity.name);
      if (!entity.contactIdNumber) throw new Error('Mangler fødselsnummer for kontaktperson: ' + entity.name);
      CompanyValidator.validateIdNumber(entity.contactIdNumber, entity.contactName);
    }
  }

  public static validateFounders(companyForm: StartCompanyRequest) {
    if (!companyForm.founders || !companyForm.founders.length) throw new Error('Mangler eiere.');
    let totalStock = 0;
    for (const founder of companyForm.founders) {
      totalStock += founder.numberOfShares;
      const entity = companyForm.entities.find(e => e.idNumber === founder.idNumber);
      if (!entity) throw new Error('Fant ikke data for stifter: ' + founder.idNumber);
      CompanyValidator.validateAddress(entity.address!, entity.name);
    }
    if (totalStock !== companyForm.shares.numberOfShares) {
      throw new Error('Bare ' + totalStock + ' av selskapets ' + companyForm.shares.numberOfShares + ' aksjer ' +
        'er fordelt.');
    }
  }

  public static validateBoard(boardMembers: BoardMemberAttributes[], entities: LegalEntity[]) {
    if (!boardMembers || boardMembers.length === 0) throw new Error('Selskapet må ha styreleder.');
    let numberOfChairs = 0;
    for (const member of boardMembers) {
      if (member.role === BoardRole.Chairman) {
        numberOfChairs += 1;
      }
      const entity = entities.find(e => e.idNumber === member.idNumber);
      if (!entity) throw new Error('Fant ikke data for styremedlem: ' + member.idNumber);
    }
    if (numberOfChairs === 0) throw new Error('Mangler styreleder i styret.');
    else if (numberOfChairs > 1) throw new Error('Du kan ikke ha flere enn én styreleder.');
  }

  private static isBeneficialOwner(idNumber: string, beneficialOwners: FounderAttributes[]) {
    for (const beneficialOwner of beneficialOwners) {
      if (beneficialOwner.idNumber === idNumber) {
        return true;
      }
    }
    return false;
  }

  public static validateBeneficialOwners(companyForm: StartCompanyRequest, entityMap: Map<string, LegalEntity>) {
    const pct25 = companyForm.shares.numberOfShares / 4;
    for (const owner of companyForm.founders) {
      if (entityMap.get(owner.idNumber)!.type === EntityType.Person && owner.numberOfShares >= pct25) {
        if (!CompanyValidator.isBeneficialOwner(owner.idNumber, companyForm.vingerForm.beneficialOwners)) {
          throw new Error(`Eier med id-nummer ${owner.idNumber} eier 25% eller mer av selskapet, men er ikke `
            + 'lagt inn som reell rettighetshaver.');
        }
      }
    }
    for (const beneficialOwner of companyForm.vingerForm.beneficialOwners) {
      const entity = entityMap.get(beneficialOwner.idNumber);
      if (!entity) throw new Error('Fant ikke data for rettighetshaver: ' + beneficialOwner.idNumber);
      CompanyValidator.validateAddress(entity.address!, entity.name);
    }
  }

  public static validateAddress(address: Address, desc?: string) {
    if (!address) throwError('Mangler adresse.', desc);
    if (!address.addressLine1) throwError('Mangler gateadresse.', desc);
    if (!address.country) throwError('Mangler land.', desc);
    if (!address.city) throwError('Mangler poststed.', desc);
    if (!address.zipCode) throwError('Mangler postnummer.', desc);
  }

  public static validateEntityName(name: string) {
    if (!name) throw new Error('Mangler navn.');
  }

  public static validateIdNumber(idNumber: string, desc?: string) {
    if (idNumber.length === 9) {
      CompanyValidator.validateOrganisationNumber(idNumber, desc);
    } else if (idNumber.length === 11) {
      CompanyValidator.validatePersonNumber(idNumber, desc);
    } else {
      throwError('ID-nummer må være 9 eller 11 siffer.', desc);
    }
  }

  public static validatePersonNumber(idNumber: string, description?: string) {
    description = description ? `${description}: ` : '';
    if (idNumber.length !== 11) {
      throw new Error(`${description}Personnummer må være nøyaktig 11 siffer.`);
    }
    const num1 = parseInt(idNumber.substring(0, 1));
    const num2 = parseInt(idNumber.substring(1, 2));
    const num3 = parseInt(idNumber.substring(2, 3));
    const num4 = parseInt(idNumber.substring(3, 4));
    const num5 = parseInt(idNumber.substring(4, 5));
    const num6 = parseInt(idNumber.substring(5, 6));
    const num7 = parseInt(idNumber.substring(6, 7));
    const num8 = parseInt(idNumber.substring(7, 8));
    const num9 = parseInt(idNumber.substring(8, 9));
    const num10 = parseInt(idNumber.substring(9, 10));
    const num11 = parseInt(idNumber.substring(10));
    const controlSum1 = num1 * 3 + num2 * 7 + num3 *  6 + num4 + num5 * 8 + num6 * 9
      + num7 * 4 + num8 * 5 + num9 * 2 + num10;
    const controlSum2 = num1 * 5 + num2 * 4 + num3 * 3 + num4 * 2 + num5 * 7 + num6 * 6
      + num7 * 5 + num8 * 4 + num9 * 3 + num10 * 2 + num11;
    if (controlSum1 % 11 !== 0 || controlSum2 % 11 !== 0) {
      throw new Error(`${description}Ugyldig personnummer.`);
    }
  }

  public static validateOrganisationNumber(idNumber: string, description?: string) {
    description = description ? `${description}: ` : '';
    if (idNumber.length !== 9) {
      throw new Error(`${description}Organisasjonsnummer må være nøyaktig 9 siffer.`);
    }
    const num1 = parseInt(idNumber.substring(0, 1));
    const num2 = parseInt(idNumber.substring(1, 2));
    const num3 = parseInt(idNumber.substring(2, 3));
    const num4 = parseInt(idNumber.substring(3, 4));
    const num5 = parseInt(idNumber.substring(4, 5));
    const num6 = parseInt(idNumber.substring(5, 6));
    const num7 = parseInt(idNumber.substring(6, 7));
    const num8 = parseInt(idNumber.substring(7, 8));
    const num9 = parseInt(idNumber.substring(8));
    const controlSum = num1 * 3 + num2 * 2 + num3 * 7 + num4 * 6 + num5 * 5 + num6 * 4 + num7 *  3 + num8 * 2;
    const mod = controlSum % 11;
    const controlNum = 11 - mod;
    if (controlNum !== num9) {
      throw new Error(`${description}Ugyldig organisasjonsnummer.`);
    }
  }

  public static isIdNumberCompany(idNumber: string) {
    const num1 = parseInt(idNumber.substring(0, 1));
    return num1 === 8 || num1 === 9;
  }

  public static getNonAsName(companyName: string) {
    if (companyName.startsWith('AS')) {
      return companyName.substring(3);
    } else if (companyName.endsWith('AS')) {
      return companyName.substring(0, companyName.length - 3);
    } else {
      return companyName;
    }
  }

  public static validateCompanyName(companyName: string) {
    if (!companyName) throw new Error('Mangler selskapsnavn.');
    const hasAsInName = companyName.startsWith('AS ') || companyName.endsWith(' AS');
    const nonAsName = CompanyValidator.getNonAsName(companyName);
    if (nonAsName.length < 3) {
      throw new Error('Firmanavnet må være på minst tre bokstaver.');
    } else if (!hasAsInName) {
      throw new Error('Firmanavnet må slutte eller begynne med bokstavene AS.');
    }
    const lowerCaseNonAsName = nonAsName.toLowerCase();
    for (const country of countries) {
      if (country.toLowerCase() === lowerCaseNonAsName) {
        throw new Error('Firmanavnet kan ikke være kun navnet på et land.');
      }
    }
    for (const county of counties) {
      if (county.toLowerCase() === lowerCaseNonAsName) {
        throw new Error('Firmanavnet kan ikke være kun navnet på et fylke.');
      }
    }
  }

  public static validateEmail(email: string) {
    if (!email) throw new Error('Mangler e-post');
  }

  public static validatePhoneNumber(email: string) {
    if (!email) throw new Error('Mangler telefonnummer');
  }

  public static validateCompanyCapital(capital: number) {
    if (!capital) {
      throw new Error('Mangler aksjekapital.');
    }
    if (capital < 30000) {
      throw new Error('Aksjekapitalen må være minst 30.000.');
    }
  }

  public static validateVingerForm(companyForm: StartCompanyRequest, entityMap: Map<string, LegalEntity>) {
    const vingerForm = companyForm.vingerForm;

    const boardRightToSign = vingerForm.boardRightToSign;
    if (!boardRightToSign) throw new Error('Mangler informasjons om styrets signeringsrett.');
    const boardRightToSignOpts = Object.keys(constants.boardRightToSign).map((k) => constants.boardRightToSign[k]);
    if (!boardRightToSignOpts.includes(boardRightToSign)) {
      throw new Error(`Ugyldig signeringstype for styret: ${boardRightToSign}`);
    }

    const keyPersonellRightToSign = vingerForm.keyPersonellRightToSign;
    if (!keyPersonellRightToSign) throw new Error('Mangler informasjons om nøkkelpersoners signeringsrett.');
    const keyPersonellRightToSignOpts
      = Object.keys(constants.keyPersonellRightToSign).map((k) => constants.keyPersonellRightToSign[k]);
    if (!keyPersonellRightToSignOpts.includes(keyPersonellRightToSign)) {
      throw new Error(`Ugyldig signeringstype for nøkkelpersoner: ${keyPersonellRightToSign}`);
    }

    if (vingerForm.accountantIdNumber) {
      CompanyValidator.validateIdNumber(vingerForm.accountantIdNumber, 'Regnskapsfører');
      if (!CompanyValidator.isIdNumberCompany(vingerForm.accountantIdNumber)) {
        if (!vingerForm.accountantLastName) throw new Error('Mangler etternavn på regnskapsfører.');
      }
    }

    if (vingerForm.auditorIdNumber) {
      CompanyValidator.validateOrganisationNumber(vingerForm.auditorIdNumber, 'Revisor');
    }

    if (vingerForm.ceoIdNumber) {
      CompanyValidator.validatePersonNumber(vingerForm.ceoIdNumber);
      if (!vingerForm.ceoLastName) throw new Error('Mangler etternavn på daglig leder.');
    }

    if (vingerForm.autoBanking === undefined) throw new Error('Mangler valg om selvbetjent bankopprettelse.');
    if (vingerForm.autoBanking) {
      if (!vingerForm.bankLogonPreference) throw new Error('Mangler valg om foretrukket innloggingsmetode i bank.');
      if (vingerForm.bankLogonPreference !== constants.bankLogonPreference.bankid &&
        vingerForm.bankLogonPreference !== constants.bankLogonPreference.kodebrikke) {
        throw new Error(`Ugyldig innloggingsmetode i bank: ${vingerForm.bankLogonPreference}`);
      }

      let banker: LegalEntity;
      if (companyForm.ceoIdNumber) {
        banker = entityMap.get(companyForm.ceoIdNumber)!;
      } else {
        const chair = companyForm.board.find(member => member.role === BoardRole.Chairman)!;
        banker = entityMap.get(chair.idNumber)!;
      }
      if (!banker.address) throw new Error(`Mangler adresse for bankkontakt (${banker.idNumber}).`);
      CompanyValidator.validateAddress(banker.address, 'Bankkontakt');
      if (!banker.phoneNumber) throw new Error('Mangler telefonnummer for bankkontakt.');
      CompanyValidator.validatePhoneNumber(banker.phoneNumber);
      if (!vingerForm.contactTaxCountry) throw new Error('Mangler skattemessig hjemland for bankkontakt.');

      if (typeof(vingerForm.expectedRevenue) !== 'number') throw new Error('Mangler forventet omsetning.');
      if (typeof(vingerForm.expectedMaxMonthlyRevenue) !== 'number') {
        throw new Error('Mangler maksimal forventet omsetning.');
      }

      if (typeof(vingerForm.transfersAbroadPerMonth) !== 'number') {
        throw new Error('Mangler antall utenlandsoverføringer.');
      }
      if (vingerForm.transfersAbroadPerMonth !== 0) {
        if (typeof(vingerForm.transfersAbroadAmountPerMonth) !== 'number') {
          throw new Error('Mangler sum for utenlandsoverføringer.');
        }
        if (typeof(vingerForm.transfersAbroadMaxTransactionAmount) !== 'number') {
          throw new Error('Mangler maks verdi per transaksjon for utenlandsoverføringer.');
        }
        if (typeof(vingerForm.transfersAbroaderPerMonth) !== 'number') {
          throw new Error('Mangler antall utenlandsoverføringer utenfor EU.');
        }
        if (vingerForm.transfersAbroaderPerMonth !== 0) {
          if (typeof(vingerForm.transfersAbroaderAmountPerMonth) !== 'number') {
            throw new Error('Mangler sum for utenlandsoverføringer utenfor EU.');
          }
          if (typeof(vingerForm.transfersAbroaderMaxTransactionAmount) !== 'number') {
            throw new Error('Mangler maks verdi per transaksjon for utenlandsoverføringer utenfor EU.');
          }
          if (!vingerForm.moneyTransfersAbroaderDesc) {
            throw new Error('Mangler beskrivelse for utenlandstransaksjoner.');
          }
          if (!vingerForm.moneyTransferCountries) {
            throw new Error('Mangler angivelse av land for utenlandstransaksjoner.');
          }
          if (!vingerForm.moneyTransferCurrencies) {
            throw new Error('Mangler angivelse av valuta for utenlandstransaksjoner.');
          }
        }
      }

      if (vingerForm.parentCompanyName) {
        if (!vingerForm.parentCompanyIdNumber) throw new Error('Mangler org.nr for morselskap.');
        if (vingerForm.parentCompanyStockExchange) {
          if (!vingerForm.parentCompanyISIN) throw new Error('Mangler ISIN-nummer for morselskap.');
        }
      }

      if (vingerForm.otherAgreementsExist === undefined) {
        throw new Error('Mangler angivelse om andre avtaler eksisterer.');
      }
    }

    CompanyValidator.validateBeneficialOwners(companyForm, entityMap);
  }
}
