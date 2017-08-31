import {vinger} from "./handlers/vinger_handlers";
import StartCompanyRequest = vinger.StartCompanyRequest;
import PrivateOwner = vinger.PrivateOwner;
import CompanyOwner = vinger.CompanyOwner;
import {Address} from "./shared";
import {counties, countries} from './src/data/countries';
import OwnedBoardMemberData = vinger.OwnedBoardMemberData;
import BoardMemberData = vinger.BoardMemberData;

export class CompanyValidator {

  static validateCompanyForm(companyForm: StartCompanyRequest) {
    CompanyValidator.validateCompanyCapital(companyForm.totalCapital);
    if (!companyForm.contactName) throw new Error('Mangler navn på kontaktperson.');
    CompanyValidator.validateName(companyForm.contactName);
    CompanyValidator.validateEmail(companyForm.contactEmail);
    CompanyValidator.validateCompanyName(companyForm.companyName);
    CompanyValidator.validateOwners(companyForm);
    CompanyValidator.validateBoard((companyForm.board))
  }

  static validateOwners(companyForm: StartCompanyRequest) {
    if (!companyForm.owners || !companyForm.owners.length) throw new Error('Mangler eiere.');
    let totalStock = 0;
    for (const owner of companyForm.owners) {
      totalStock += owner.numberOfShares;
      CompanyValidator.validateOwner(owner);
    }
    if (totalStock !== companyForm.numberOfShares) {
      throw new Error('Only ' + totalStock + ' of the companys ' + companyForm.numberOfShares + ' where ' +
        'accounted for in owners.');
    }
  }

  static validateOwner(owner: PrivateOwner | CompanyOwner) {
    if (!owner.id) throw new Error('Mangler id.');
    CompanyValidator.validateName(owner.name);
    CompanyValidator.validateEmail(owner.email);
    CompanyValidator.validateAddress(owner.address);
    if (!owner.idNumber) throw new Error('Mangler personnummer.');
  }

  static validateBoard(board: Array<BoardMemberData | OwnedBoardMemberData>) {
    if (!board || board.length === 0) throw new Error('Mangler styreleder i styret.');
    let foundDirector = false;
    for (const member of board) {
      if (member.role === 'Styreleder') {
        foundDirector = true;
      }
    }
    if (!foundDirector) throw new Error('Mangler styreleder i styret.');
  }

  static validateAddress(address: Address) {
    if (!address) throw new Error('Mangler adresse.');
    if (!address.addressLine1) throw new Error('Mangler gateadresse.');
    if (!address.country) throw new Error('Mangler land.');
    if (!address.city) throw new Error('Mangler poststed.');
    if (!address.zipCode) throw new Error('Mangler postnummer.');
  }

  static validateName(name: string) {
    if (!name) throw new Error('Mangler navn.');
  }

  static validateIdNumber() {
    
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


  static validateCompanyCapital(capital: number) {
    if (!capital) {
      throw new Error('Mangler aksjekapital.');
    }
    if (capital < 30000) {
      throw new Error('Aksjekapitalen må være minst 30.000.');
    }
  }
}