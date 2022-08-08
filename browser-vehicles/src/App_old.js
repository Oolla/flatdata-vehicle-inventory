// https://github.com/learnwithparam/logrocket-smart-table/blob/master/src/App.js

import React, { useMemo, useState, useEffect } from 'react';
import Table from './Table';
import inventory from './inventory.json';
import dealer from './dealerInfo.json';
import './App.css';

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

function App() {
  const columns = useMemo(
    () => [
      {
        // First Group: Dealer
        Header: 'Dealer',
        columns: [
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
        ],
      },
      {
        // Second Group: Vehicle
        Header: 'Vehicle',
        columns: [
          { Header: 'VIN', accessor: 'vin' },
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
          { Header: 'Base MSRP', accessor: 'base_msrp' },
          { Header: 'Total MSRP', accessor: 'total_msrp' },
          { Header: 'Availability Date', accessor: 'availability_date' },
          { Header: 'Total Packages', accessor: 'total_packages' },
          {
            Header: 'Package(s)',
            accessor: 'packages',
            Cell: ({ cell: { value } }) => <Packages values={value} />,
          },
          { Header: 'Vehicle Created', accessor: 'created_at' },
        ],
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      let merged = [];

      for (let i = 0; i < inventory.length; i++) {
        merged.push({
          ...inventory[i],
          ...dealer.find(item => item.dealer_code === inventory[i].dealer),
        });
      }
      merged = merged.map(el => {
        el.packages = el.packages.split(',');
        return el;
      });
      console.log('merged.length = ' + merged.length);

      setData(merged);
    })();
  }, []);

  return (
    <div className="App">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
