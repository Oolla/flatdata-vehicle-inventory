const axios = require('axios');
const { Vendors } = require('./Enums.js');

let Vendor = class {
  constructor(vendor) {
    this.vendorMeta = this._getMapping(vendor);
  }

  _getMapping(vendor) {
    console.log(`vendor = ${vendor}`);
    let mapping = Vendors.filter(el => el.name.toLowerCase() === vendor.toLowerCase());
    if (mapping.length !== 1) {
      throw new Error(`Unable to locate the mapping for vendor, '${vendor}'.`);
    }
    return mapping[0];
  }

  _stripInfo(dealer, body) {
    if (!body.showDealerLocatorDataArea || !body.showDealerLocatorDataArea.dealerMetaData) {
      return { dealer_code: dealer, data: 'No data exists for this dealer' };
    }

    let dealerCode =
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].dealerParty.partyID
        .value;
    let companyName =
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].dealerParty
        .specifiedOrganization.companyName.value;
    let ownershipStartDate = new Date(
      body.showDealerLocatorDataArea.dealerMetaData[0].dealerMetaDataDetail[0].ownership.currentOwner.startDate
    ).toISOString();
    let phoneNumber =
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].dealerParty
        .specifiedOrganization.primaryContact[0].telephoneCommunication[0].completeNumber.value;
    let website =
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].dealerParty
        .specifiedOrganization.primaryContact[0].uricommunication[0].uriid.value;
    let streetAddress = this._getAddress(
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].dealerParty
        .specifiedOrganization.postalAddress
    );
    let geoAddress = this._getGeoAddress(
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].proximityMeasureGroup
        .geographicalCoordinate
    );
    let salesHours = this._getSalesHours(
      body.showDealerLocatorDataArea.dealerLocator[0].dealerLocatorDetail[0].hoursOfOperation
    );
    if (!salesHours) {
      throw new Error(`Unable to locate the Sales or General hours for dealer ID: ${dealer}.`);
    }

    return {
      dealer_code: dealerCode,
      ownership_start_date: ownershipStartDate,
      company_name: companyName,
      postal_address: streetAddress,
      geo_address: geoAddress,
      sales_hours: salesHours,
      phone_number: phoneNumber,
      website: website,
    };
  }

  _getAddress(data) {
    return {
      street_one: data.lineOne.value,
      street_two: (data.lineTwo && data.lineTwo.value) || '',
      city: data.cityName.value,
      country: data.countryID,
      postcode: data.postcode.value,
      state: data.stateOrProvinceCountrySubDivisionID.value,
    };
  }

  _getGeoAddress(data) {
    if (!data) {
      return { lat: 'None', long: 'None' };
    }
    return {
      lat: (data.latitudeMeasure && data.latitudeMeasure.value) || 'None',
      long: (data.longitudeMeasure && data.latitudeMeasure.value) || 'None',
    };
  }

  _getSalesHours(data) {
    if (!data) {
      return [];
    }

    let index = -1;
    index = data.findIndex(el => el.hoursTypeCode.toLowerCase() === 'sales');
    if (index === -1) {
      index = data.findIndex(el => el.hoursTypeCode.toLowerCase() === 'general');
      if (index === -1 && data[0]) {
        index = 0;
      }
    }

    let formattedSalesHours = data[index].daysOfWeek.map(el => {
      return {
        day: el.dayOfWeekCode,
        open:
          (el.availabilityStartTimeMeasure && el.availabilityStartTimeMeasure.value / 60 + '00') ||
          'Closed',
        close:
          (el.availabilityEndTimeMeasure && el.availabilityStartTimeMeasure.value / 60 + '00') ||
          'Closed',
      };
    });

    return formattedSalesHours;
  }

  async getLocation(dealers) {
    let killCountMax = 10;
    let killCount = 0;
    let failedRetrievals = [];

    let beatufiedDealerInfo = [];

    for (let dealer of dealers) {
      dealer = dealer.trim();
      if (killCount === killCountMax) {
        console.log(
          `Terminating the requests to vendor after ${killCountMax} failed sequentially.`
        );
        break;
      }
      let url = this.vendorMeta.location_route.replace('{{id}}', dealer);
      try {
        let response = await axios.get(url);
        let dealerInfo = this._stripInfo(dealer, response.data);

        console.log(`Got info for dealer: ${dealerInfo.dealer_code}`);
        beatufiedDealerInfo.push(dealerInfo);
      } catch (err) {
        failedRetrievals.push(dealer);
        console.log(`Failed -- dealer: ${dealer}, response: ${err}`);
        killCount += 1;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`Issues looking up ${killCount} stores: [${failedRetrievals}].`);
    return beatufiedDealerInfo;
  }
};

module.exports = Vendor;
