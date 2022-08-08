/* Resources:
 * - https://github.com/TheWidlarzGroup/RT7-example/tree/102c5bbfddf9e01e556b84e81de51ef2cef3ba5e/src
 * - https://github.com/learnwithparam/logrocket-smart-table/blob/master/src/App.js
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Container, Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';
import TableContainer from './TableContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { SelectColumnFilter } from './filters';
import vehicleData from './data/inventoryAndDealer.json';

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const doFetch = async () => {
      console.log(`vehicleData.length: ${vehicleData.length}`);
      setData(vehicleData);
    };
    doFetch();
  }, []);

  const renderRowSubComponent = row => {
    const {
      vin,
      total_packages,
      base_msrp,
      dealer,
      company_name,
      postal_address: { street_one, city, state, postcode },
      geo_address: { lat, long },
      phone_number,
      website,
      ownership_start_date,
      sales_hours,
      // Import the two of the photos here, one inside & oen outside.
    } = row.original;
    return (
      <Card style={{ width: '50%', margin: '0 auto' }}>
        <CardBody>
          <CardTitle>
            <strong>VIN</strong>: {vin}
          </CardTitle>
          <CardText>
            <strong>Package Count</strong>: {total_packages} <br />
            <strong>Base MSRP</strong>: {base_msrp} <br />
            <strong>Dealer ID</strong>: {dealer} <br />
            <strong>Dealer Name</strong>: {company_name} <br />
            <strong>Dealer Created Date</strong>: {ownership_start_date} <br />
            <strong>Phone</strong>: {phone_number} <br />
            <strong>Website</strong>: {website} <br />
            <strong>Address</strong>: {`${street_one} ${city}, ${state} ${postcode}`} <br />
            <strong>Geo</strong>: {`Lat - ${lat}, Long - ${long}`} <br />
            <strong>Hours</strong>
            <br />{' '}
            {`${sales_hours[0].day} - Opens: ${sales_hours[0].open} Closes: ${sales_hours[0].close}`}
            <br />
            {`${sales_hours[1].day} - Opens: ${sales_hours[1].open} Closes: ${sales_hours[1].close}`}
            <br />
            {`${sales_hours[2].day} - Opens: ${sales_hours[2].open} Closes: ${sales_hours[2].close}`}
            <br />
            {`${sales_hours[3].day} - Opens: ${sales_hours[3].open} Closes: ${sales_hours[3].close}`}
            <br />
            {`${sales_hours[4].day} - Opens: ${sales_hours[4].open} Closes: ${sales_hours[4].close}`}
            <br />
            {`${sales_hours[5].day} - Opens: ${sales_hours[5].open} Closes: ${sales_hours[5].close}`}
            <br />
            {`${sales_hours[6].day} - Opens: ${sales_hours[6].open} Closes: ${sales_hours[6].close}`}
          </CardText>
        </CardBody>
      </Card>
    );
  };

  const Packages = ({ values }) => {
    return (
      <>
        {values.map((pkg, idx) => {
          return (
            <span key={idx} className="badge">
              {pkg}
            </span>
          );
        })}
      </>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander', // 'id' is required
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? '-' : '+'}</span>
          // <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? '👇' : '👉'}</span>
        ),
      },

      // { Header: 'VIN', accessor: 'vin'
      // disableSortBy: true,
      // Filter: SelectColumnFilter,
      // filter: 'equals' },
      { Header: 'Year', accessor: 'year' },
      { Header: 'Model', accessor: 'vehicle' },
      { Header: 'Trim', accessor: 'model' },
      { Header: 'Engine', accessor: 'enginge' }, // "Enginge" needs to be corrected when inventory.json is being created.
      { Header: 'Transmission', accessor: 'transmission' },
      { Header: 'Drivetrain', accessor: 'drivetrain' },
      { Header: 'Cab', accessor: 'cab' },
      { Header: 'Bed', accessor: 'bed' },
      { Header: 'Color', accessor: 'color' },
      { Header: 'Interior', accessor: 'interior' },
      { Header: 'MSRP', accessor: 'total_msrp' },
      { Header: 'Availability Date', accessor: 'availability_date' },
      {
        Header: 'Packages',
        accessor: 'packages',
        Cell: ({ cell: { value } }) => <Packages values={value} />,
      },
      { Header: 'City', accessor: 'postal_address.city' },
      { Header: 'State', accessor: 'postal_address.state' },

      /*
      { Header: 'VIN', accessor: 'vin' },
      { Header: 'Total Packages', accessor: 'total_packages' },
      { Header: 'Base MSRP', accessor: 'base_msrp' },
      { Header: 'Number', accessor: 'dealer' },
      { Header: 'Dealer Name', accessor: 'company_name' },
      { Header: 'Street', accessor: 'postal_address.street_one' },
      { Header: 'City', accessor: 'postal_address.city' },
      { Header: 'State', accessor: 'postal_address.state' },
      { Header: 'Zip', accessor: 'postal_address.postcode' },
      { Header: 'Latitute', accessor: 'geo_address.lat' },
      { Header: 'Longitude', accessor: 'geo_address.long' },
      { Header: 'Phone', accessor: 'phone_number' },
      { Header: 'Website', accessor: 'website' },
      { Header: 'Dealer Opened', accessor: 'ownership_start_date' },
      { Header: 'Sales HOO', accessor: 'sales_hours' },
      */

      //   {
      //     Header: 'Hemisphere',
      //     accessor: values => {
      //       const { latitude, longitude } = values.location.coordinates;
      //       const first = Number(latitude) > 0 ? 'N' : 'S';
      //       const second = Number(longitude) > 0 ? 'E' : 'W';
      //       return first + '/' + second;
      //     },
      //     disableSortBy: true,
      //     Filter: SelectColumnFilter,
      //     filter: 'equals',
      //     Cell: ({ cell }) => {
      //       const { value } = cell;

      //       const pickEmoji = value => {
      //         let first = value[0]; // N or S
      //         let second = value[2]; // E or W
      //         const options = ['⇖', '⇗', '⇙', '⇘'];
      //         let num = first === 'N' ? 0 : 2;
      //         num = second === 'E' ? num + 1 : num;
      //         return options[num];
      //       };

      //       return <div style={{ textAlign: 'center', fontSize: 18 }}>{pickEmoji(value)}</div>;
      //     },
      //   },
    ],
    []
  );

  return (
    <Container style={{ marginTop: 100 }}>
      <TableContainer columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} />
    </Container>
  );
};

export default App;
