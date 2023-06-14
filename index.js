const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const port=3000;
const app = express();

// Load the dataset from the CSV file
const dataset = [];
fs.createReadStream('data.csv')
.pipe(csv())
  .on('data', (row) => {
    dataset.push(row);
  })
  .on('end', () => {
    console.log('data.csv File loaded');
  });

// API 1: Total items sold in Marketting for the  q3 last quarter of the year
app.get('/api/total_items', (req, res) => {
    // console.log("REQuest :",req);
  const { start_date, end_date, department } = req.query;

  const filteredData = dataset.filter(
    (row) =>
      row.department === department &&
      row.date >= start_date &&
      row.date <= end_date
  );

//   console.log("TESTing DEbug",filteredData);
  const totalSeats = filteredData.reduce(
    (sum, row) => sum + parseInt(row.seats),
    0
  );
  res.json({ totalSeats });
});

// API 2: nth most soldd  in terms of quantity sold in q4 or total price in q2
app.get('/api/nth_most_total_item', (req, res) => {
        // console.log("REQuest :",req);
  const { item_by, start_date, end_date, n } = req.query;

  // Fitering the DAta
  const filteredData = dataset.filter(
    (row) =>
      (item_by === 'quantity' && row.date >= start_date && row.date <= end_date) ||
      (item_by === 'price' && row.date >= start_date && row.date <= end_date)
  );

//    console.log("TESTing DEbug",filteredData);
  const groupedData = filteredData.reduce((acc, row) => {
    if (!acc[row.software]) {
      acc[row.software] = { quantity: 0, price: 0 };
    }

    acc[row.software].quantity += parseInt(row.seats);
    acc[row.software].price += parseInt(row.amount);

    return acc;
  }, {});

  let sortedData; // SOted data
  if (item_by === 'quantity') {
    sortedData = Object.entries(groupedData).sort(
      (a, b) => b[1].quantity - a[1].quantity
    );
  } else if (item_by === 'price') {
    
    // sortedData=Object.keys(groupedData);

    sortedData = Object.entries(groupedData).sort(
      (a, b) => b[1].price - a[1].price
    );
  }

  const nthItem = sortedData[n - 1][0];

  res.json({ nthItem });
});

// API 3: PEercentage of sold items department-wise
app.get('/api/percentage_of_department_wise_sold_items', (req, res) => {
  const { start_date, end_date } = req.query;

  const filteredData = dataset.filter(
    (row) => row.date >= start_date && row.date <= end_date
  );

  const groupedData = filteredData.reduce((acc, row) => {
    if (!acc[row.department]) {
      acc[row.department] = 0;
    }

    acc[row.department] += parseInt(row.seats);

    // console.log("TESTing DEbug",acc);
    return acc;
  }, {});

  const totalSeats = Object.values(groupedData).reduce(
    (sum, seats) => sum + seats,
    0
  );

  const departmentPercentages = Object.entries(groupedData).reduce(
    (acc, [department, seats]) => {
      acc[department] = ((seats / totalSeats) * 100).toFixed(2) + '%';
      return acc;
    },
    {}
  );

  res.json(departmentPercentages);
});

// API 4: MOnthly sales for a product
app.get('/api/monthly_sales', (req, res) => {
    const { product, year } = req.query;

    //deubg
    console.log(new Date("2022-10-21"));
  
    // Fileter the Data SEt
    const filteredData = dataset.filter(
      (row) =>
        row.software.toLowerCase() === product.toLowerCase() &&
        // new Date(row.date).getFullYear() === (year)
        new Date(row.date).getFullYear() === parseInt(year)
    );
  
    //TEstig
    const monthlySales = Array(12).fill(0);
  
    filteredData.forEach((row) => {
      const month = new Date(row.date).getMonth();
      monthlySales[month] += parseInt(row.amount);
    });
  
    res.json(monthlySales);
  });
  


app.listen(port, () => {
  console.log('Server is running on port 3000');
});
