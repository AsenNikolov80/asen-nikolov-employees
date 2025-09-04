
# Employee Pairs Analyzer

**Asen Nikolov - Employees Task for Sirma**

A React TypeScript application that analyzes CSV data to find pairs of employees who have worked together on projects and determines which pair has worked together for the longest time.

## 🎯 Features

- **CSV File Upload**: Upload employee project data in CSV format
- **Smart Date Parsing**: Handles various date formats using chrono-node
- **Employee Pair Analysis**: Finds all employee pairs who worked on the same projects
- **Overlap Calculation**: Calculates exact working days overlap between employees
- **Interactive Data Grid**: Displays results in a sortable, paginated table using MUI DataGrid
- **Longest Collaboration**: Highlights the pair that worked together for the most days
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Components

- **App.tsx**: Main application component
- **CSVDataComponent.tsx**: Core component handling file upload, CSV parsing, and data visualization
- **DatetimeHelper.ts**: Utility for parsing various date string formats

### Key Technologies

- **React 19.1.1** with TypeScript 5.9.2
- **MUI X Data Grid 8.11.0** for data visualization
- **Styled Components 6.1.19** for styling
- **chrono-node 2.8.4** for flexible date parsing
- **Jest & React Testing Library** for comprehensive testing

## 📋 CSV Format

The application expects CSV files with the following structure:

```csv
EmpID,ProjectID,DateFrom,DateTo
1,1,2023-01-01,2023-06-01
2,1,2023-02-01,2023-07-01
3,2,2023-03-01,2023-08-01
```

**Columns:**
- `EmpID`: Employee ID (number)
- `ProjectID`: Project ID (number)
- `DateFrom`: Start date (flexible format)
- `DateTo`: End date (flexible format)

## 🚀 Getting Started
### Prerequisites
- Node.js 18.x or higher
- npm package manager

### Installation
1. Clone the repository:
   ```git clone <repository-url> <working-directory>```
2. Navigate to the project directory:
```cd <working-directory>```
3. Run ```docker-compose up --build``` to start the application with dev and prod containers ready
4. Open ```http://localhost:3000``` in your browser for dev environment with live reload
5. Open ```http://localhost:8080``` in your browser for prod environment
6. Alternatively, run```docker-compose build``` and ```docker-compose up react-dev``` for dev environment only, or ```docker-compose up react-prod``` for prod environment only

## 🧪 Testing
The application includes comprehensive test coverage:
### Test Types
- **Unit Tests**: Component rendering and functionality
- **Integration Tests**: Full workflow from CSV upload to data display
- **UI Tests**: DataGrid columns, file input validation
- **Edge Cases**: Empty files, invalid formats, date parsing

### Test Coverage Areas
- ✅ CSV file upload and validation
- ✅ Date parsing with various formats
- ✅ Employee overlap calculation
- ✅ DataGrid rendering and columns
- ✅ Error handling and edge cases
- ✅ Keyboard navigation and accessibility

# Running Tests
### Run tests in watch mode
npm test

### Run tests with coverage
npm test -- --coverage --watchAll=false

### Run tests in CI mode
npm run test:ci

### Key Test Scenarios
- CSV parsing with header and without header
- Multiple employees on same project
- Overlapping work periods calculation
- Empty file handling
- Date format flexibility
- DataGrid column validation

## 🐳 Docker Support
### Development Environment
#### Build and run development container
docker-compose up react-dev
### Production Build
#### Build and run production container
docker-compose up react-prod

## 🏃‍♂️ CI/CD
GitHub Actions workflow automatically:
- Runs all tests on push to main/develop branches
- Validates build process
- Ensures code quality before merging

## 📊 Algorithm
The application uses the following logic:
1. **Parse CSV**: Extract employee, project, and date information
2. **Group by Project**: Organize employees by project ID
3. **Find Pairs**: For each project, find all employee pairs
4. **Calculate Overlap**: Determine working days overlap between pairs
5. **Find Maximum**: Identify the pair with longest collaboration
6. **Display Results**: Show all pairs for the longest-working duo

## 🎨 UI Features
- **Styled Components**: Custom styling with background colors
- **MUI DataGrid**: Professional data table with sorting and pagination
- **Responsive Design**: Adapts to different screen sizes
- **File Upload**: Drag-and-drop CSV file interface
- **Loading States**: Visual feedback during processing

### Adding New Features
1. Write tests first (TDD approach)
2. Implement functionality
3. Update documentation
4. Ensure all tests pass

## 📝 License
This project was created as a technical assessment for Sirma.
## 👤 Author
**Asen Nikolov**
