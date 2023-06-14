
1. clone the git repo and in terminal use npm install to install all dependenct express,csv parser
2. run node index.js in terminal 
3. there are two wats to test 1st is curl or postman ,i used poostmen for testing
4. go to the following Links in Browser or can use postman to get data and have to change the query parameters according to the requirements
5. for testing the first API : http://localhost:3000/api/total_items?&start_date=2022-10-01&end_date=2022-12-31&department=Tech
   setup the query parameters according to need 
6. Second API :http://localhost:3000/api/percentage_of_department_wise_sold_items?start_date=2022-01-01&end_date=2022-12-31
7. 3rd API : http://localhost:3000/api/monthly_sales?product=Sentry&year=2022
8. 4th API : http://localhost:3000/api/nth_most_total_item?item_by=quantity&start_date=2022-10-01&end_date=2022-12-31&n=4