import {vinger} from "./handlers/vinger_handlers";
import StartCompanyRequest = vinger.StartCompanyRequest;
import {Address, VingerFormAttributes} from "./shared";
import {counties, countries} from './src/data/countries';
import {constants} from "./src/constants";
import {unescape} from "querystring";
import StartCompanyVingerForm = vinger.StartCompanyVingerForm;
import Owner = vinger.Owner;
import BoardMemberAttributes = vinger.BoardMemberAttributes;

export class CompanyValidator {

  static validateCompanyForm(companyForm: StartCompanyRequest) {
    CompanyValidator.validateCompanyCapital(companyForm.shares.totalCapital);
    if (!companyForm.contactName) throw new Error('Mangler navn på kontaktperson.');
    CompanyValidator.validatePersonFullName(companyForm.contactName);
    CompanyValidator.validateEmail(companyForm.contactEmail);
    CompanyValidator.validateCompanyName(companyForm.name);
    CompanyValidator.validateOwners(companyForm);
    CompanyValidator.validateBoard((companyForm.board));
    CompanyValidator.validateVingerForm(companyForm);
  }

  static validateOwners(companyForm: StartCompanyRequest) {
    if (!companyForm.owners || !companyForm.owners.length) throw new Error('Mangler eiere.');
    let totalStock = 0;
    for (const owner of companyForm.owners) {
      totalStock += owner.numberOfShares;
      CompanyValidator.validateOwner(owner);
    }
    if (totalStock !== companyForm.shares.numberOfShares) {
      throw new Error('Bare ' + totalStock + ' av selskapets ' + companyForm.shares.numberOfShares + ' aksjer ' +
        'er fordelt.');
    }
  }

  static validateOwner(owner: Owner) {
    CompanyValidator.validatePersonFullName(owner.name);
    CompanyValidator.validateEmail(owner.email);
    CompanyValidator.validateAddress(owner.address);
    if (!owner.idNumber) throw new Error('Mangler personnummer.');
  }

  static validateBoard(board: Array<BoardMemberAttributes>) {
    if (!board || board.length === 0) throw new Error('Mangler styreleder i styret.');
    let foundDirector = false;
    for (const member of board) {
      if (member.role === 'Styreleder') {
        foundDirector = true;
      }
    }
    if (!foundDirector) throw new Error('Mangler styreleder i styret.');
  }

  static _isBeneficialOwner(idNumber: string, beneficialOwners: Owner[]) {
    for (const beneficialOwner of beneficialOwners) {
      if (beneficialOwner.idNumber === idNumber) {
        return true;
      }
    }
    return false;
  }

  static validateBeneficialOwners(companyForm: StartCompanyRequest) {
    const pct25 = companyForm.shares.numberOfShares / 4;
    for (const owner of companyForm.owners) {
      if (owner.numberOfShares >= pct25) {
        if (!CompanyValidator._isBeneficialOwner(owner.idNumber, companyForm.vingerForm.beneficialOwners)) {
          throw new Error(`Eier med id-nummer ${owner.idNumber} eier 25% eller mer av selskapet, men er ikke `
            + 'lagt inn som reell rettighetshaver.');
        }
      }
    }
    for (const beneficialOwner of companyForm.vingerForm.beneficialOwners) {
      CompanyValidator.validateOwner(beneficialOwner);
    }
  }


  static validateAddress(address: Address) {
    if (!address) throw new Error('Mangler adresse.');
    if (!address.addressLine1) throw new Error('Mangler gateadresse.');
    if (!address.country) throw new Error('Mangler land.');
    if (!address.city) throw new Error('Mangler poststed.');
    if (!address.zipCode) throw new Error('Mangler postnummer.');
  }

  static validatePersonFullName(name: string) {
    if (!name) throw new Error('Mangler navn.');
  }

  static validateIdNumber(idNumber: string, description?: string) {
    if (idNumber.length === 9) {
      CompanyValidator.validateOrganisationNumber(idNumber, description);
    } else if (idNumber.length === 11) {
      CompanyValidator.validatePersonNumber(idNumber, description);
    } else {
      const desc = description ? `${description}: ` : '';
      throw new Error(`${desc}Personnummer må være nøyaktig 11 siffer, og org-nummer må være nøyaktig 9 siffer.`)
    }
  }

  static validatePersonNumber(idNumber: string, description?: string) {
    description = description ? `${description}: ` : '';
    if (idNumber.length !== 11) {
      throw new Error(`${description}Personnummer må være nøyaktig 11 siffer.`)
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
      throw new Error(`${description}Ugyldig personnummer.`)
    }
  }

  static validateOrganisationNumber(idNumber: string, description?: string) {
    description = description ? `${description}: ` : '';
    if (idNumber.length !== 9) {
      throw new Error(`${description}Organisasjonsnummer må være nøyaktig 9 siffer.`)
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
      throw new Error(`${description}Ugyldig organisasjonsnummer.`)
    }
  }

  static isIdNumberCompany(idNumber: string) {
    const num1 = parseInt(idNumber.substring(0, 1));
    return num1 == 8 || num1 == 9;
  }

  static validateCompanyName(companyName: string) {
    if (!companyName) throw new Error('Mangler selskapsnavn.');
    let nonAsName;
    if (companyName.startsWith('AS')) {
      nonAsName = companyName.substring(3);
    } else if (companyName.endsWith('AS')) {
      nonAsName = companyName.substring(0, companyName.length - 3);
    } else {
      nonAsName = companyName;
    }
    const hasAsInName = companyName.startsWith('AS') || companyName.endsWith('AS');

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

  static validateEmail(email: string) {
    if (!email) throw new Error('Mangler e-post');
  }

  static validatePhoneNumber(email: string) {
    if (!email) throw new Error('Mangler telefonnummer');
  }

  static validateCompanyCapital(capital: number) {
    if (!capital) {
      throw new Error('Mangler aksjekapital.');
    }
    if (capital < 30000) {
      throw new Error('Aksjekapitalen må være minst 30.000.');
    }
  }

  static validateVingerForm(companyForm: StartCompanyRequest) {
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
      CompanyValidator.validateIdNumber(vingerForm.accountantIdNumber, "Regnskapsfører");
      if (!CompanyValidator.isIdNumberCompany(vingerForm.accountantIdNumber)) {
        if (!vingerForm.accountantLastName) throw new Error('Mangler etternavn på regnskapsfører.');
      }
    }

    if (companyForm.owners.length > 1) {
      if (!vingerForm.foundationPlace) throw new Error('Mangler sted for styremøte.');
      if (!(vingerForm.foundationTime instanceof Date)) throw new Error('Mangler tid for styremøte.');
    }

    if (vingerForm.auditorIdNumber) {
      CompanyValidator.validateOrganisationNumber(vingerForm.auditorIdNumber, "Revisor");
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

      if (!vingerForm.bankContactName) throw new Error('Mangler navn på bankkontakt.');
      CompanyValidator.validatePersonFullName(vingerForm.bankContactName);
      if (!vingerForm.bankContactIdNumber) throw new Error('Mangler personnummer for bankkontakt.');
      CompanyValidator.validatePersonNumber(vingerForm.bankContactIdNumber);
      if (!vingerForm.bankContactEmail) throw new Error('Mangler e-post for bankkontakt.');
      CompanyValidator.validateEmail(vingerForm.bankContactEmail);
      if (!vingerForm.contactNumber) throw new Error('Mangler telefonnummer for bankkontakt.');
      CompanyValidator.validatePhoneNumber(vingerForm.contactNumber);
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
        if (!vingerForm.parentCompanyIdNumber) throw new Error("Mangler org.nr for morselskap.");
        if (vingerForm.parentCompanyStockExchange) {
          if (!vingerForm.parentCompanyISIN) throw new Error("Mangler ISIN-nummer for morselskap.");
        }
      }

      if (vingerForm.otherAgreementsExist === undefined) {
        throw new Error("Mangler angivelse om andre avtaler eksisterer.");
      }
    }

    CompanyValidator.validateBeneficialOwners(companyForm);
  }
}