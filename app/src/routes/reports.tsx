import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Reports = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  // const handleClick = () => {
  //   fetch(
  //     `http://localhost:8080/api/v1/transactions?from=${dateRange[0]?.toISOString()}&to=${dateRange[1]?.toISOString()}`
  //   );
  // };

  return (
    <div>
      <h1>Dish Transactions</h1>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <p
          style={{
            margin: 0,
          }}
        >
          Date Range
        </p>
        <div>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
            }}
          />
        </div>
        <a href={`http://localhost:8080/api/v1/transactions`}>
          <button>Export to CSV</button>
        </a>
      </div>
    </div>
  );
};

export default Reports;
