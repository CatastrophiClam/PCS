## Purpose
The server must keep track of several projects. Each project contains performance data stored in several tables.

## Database Structure

### Projects
Each project has its own file under model/projects containing classes that specify the layout of its tables in the db.
- Columns of the table are class variables in the classes.
- Each class has a 'metadata' field that is not part of the columns in the database
- These column names must match the csv headers of the data, and there cannot be 2 same column names

The

### Altering DB structure
- Tables and columns can be added/removed by adding/removing them in the code in project model file