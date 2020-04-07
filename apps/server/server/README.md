## Database Structure

### Model/database
- This file contains all the tables in the db as classes.
- Columns of the table are class variables in the classes.
- Each class has a 'metadata' field that is not part of the columns in the database
- These column names must match the csv headers of the data, and there cannot be 2 same column names
- The 'Tables' class stores all the tables we have as its class variables.
  - The names of these class variables must be the same as the name of the table