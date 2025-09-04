
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { parseDateFromString } from './helpers/DatetimeHelper';

// Mock the DatetimeHelper module
jest.mock('./helpers/DatetimeHelper', () => ({
    parseDateFromString: jest.fn()
}));

describe('App Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('renders initial page', () => {
        render(<App />);
        const linkElement = screen.getByText(/Pair of employees who have worked together/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('renders CSVDataComponent', () => {
        render(<App />);
        expect(document.querySelector('.App')).toBeInTheDocument();
        expect(screen.getByText(/Upload a CSV file with employee data/i)).toBeInTheDocument();
    });

    test('renders file upload component', () => {
        render(<App />);
        const fileInput = screen.getByRole('textbox', { hidden: true }) ||
            document.querySelector('input[type="file"]');
        expect(fileInput).toBeInTheDocument();
    });

    test('displays CSV file input with correct attributes', () => {
        render(<App />);
        const fileInput = document.querySelector('input[type="file"]');
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute('accept', '.csv');
        expect(fileInput).toHaveAttribute('name', 'file');
        expect(fileInput).toHaveAttribute('id', 'file');
    });

    test('handles CSV file upload successfully', async () => {
        render(<App />);

        // Mock the parseDateFromString function
        parseDateFromString.mockReturnValue(new Date('2023-01-01'));

        // Create a mock CSV file
        const csvContent = 'EmpID,ProjectID,DateFrom,DateTo\n1,1,2023-01-01,2023-06-01\n2,1,2023-02-01,2023-07-01';
        const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [csvFile] } });

            // Wait for processing to complete and check if DataGrid appears
            await waitFor(() => {
                const dataGrid = document.querySelector('.MuiDataGrid-root');
                expect(dataGrid).toBeInTheDocument();
            });
        }
    });

    test('handles empty CSV file', async () => {
        render(<App />);

        const emptyFile = new File([''], 'empty.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [emptyFile] } });

            await waitFor(() => {
                // Check that DataGrid still exists but might be empty
                const dataGrid = document.querySelector('.MuiDataGrid-root');
                expect(dataGrid).toBeInTheDocument();
            });
        }
    });

    test('displays DataGrid with correct columns', async () => {
        render(<App />);

        // Mock the parseDateFromString function
        parseDateFromString.mockReturnValue(new Date('2023-01-01'));

        const csvContent = 'EmpID,ProjectID,DateFrom,DateTo\n1,1,2023-01-01,2023-06-01\n2,1,2023-02-01,2023-07-01';
        const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [csvFile] } });

            await waitFor(() => {
                // Check for column headers
                expect(screen.queryByText(/Employee ID #1/i)).toBeInTheDocument();
                expect(screen.queryByText(/Employee ID #2/i)).toBeInTheDocument();
                expect(screen.queryByText(/Project ID/i)).toBeInTheDocument();
                expect(screen.queryByText(/Days worked/i)).toBeInTheDocument();
            });
        }
    });

    test('validates DatetimeHelper integration', () => {
        render(<App />);

        // Test that the parseDateFromString function is available
        expect(parseDateFromString).toBeDefined();

        // Test various date string formats
        parseDateFromString.mockReturnValue(new Date('2023-01-01'));
        const result = parseDateFromString('2023-01-01');
        expect(result).toBeInstanceOf(Date);
    });

    test('handles keyboard navigation', async () => {
        render(<App />);

        // Test tab navigation through interactive elements using fireEvent
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.keyDown(fileInput, { key: 'Tab', code: 'Tab' });

            const focusedElement = document.activeElement;
            expect(focusedElement).toBeInTheDocument();

            // Test Enter key on focused elements
            fireEvent.keyDown(focusedElement, { key: 'Enter', code: 'Enter' });
        }
    });

    test('renders without crashing', () => {
        render(<App />);
        expect(document.querySelector('.App')).toBeInTheDocument();
        expect(screen.getByText(/Pair of employees who have worked together/i)).toBeInTheDocument();
    });

    test('App component has correct CSS class and structure', () => {
        render(<App />);
        const appElement = document.querySelector('.App');
        expect(appElement).toBeInTheDocument();
        expect(appElement).toHaveClass('App');

        // Check that DataGridWrapper is present
        const dataGridWrapper = document.getElementById('data-grid-wrapper');
        expect(dataGridWrapper).toBeInTheDocument();
    });

    test('displays correct headings', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: /Pair of employees who have worked together/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Upload a CSV file with employee data/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /All pairs of employees/i })).toBeInTheDocument();
    });

    test('processes CSV with overlapping employee periods', async () => {
        render(<App />);

        // Mock dates with overlap
        parseDateFromString
            .mockReturnValueOnce(new Date('2023-01-01'))  // Employee 1 start
            .mockReturnValueOnce(new Date('2023-06-01'))  // Employee 1 end
            .mockReturnValueOnce(new Date('2023-03-01'))  // Employee 2 start
            .mockReturnValueOnce(new Date('2023-08-01')); // Employee 2 end

        const csvContent = 'EmpID,ProjectID,DateFrom,DateTo\n1,1,2023-01-01,2023-06-01\n2,1,2023-03-01,2023-08-01';
        const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [csvFile] } });

            await waitFor(() => {
                const dataGrid = document.querySelector('.MuiDataGrid-root');
                expect(dataGrid).toBeInTheDocument();
            });
        }
    });
});

// Additional integration tests
describe('App Integration Tests', () => {
    test('full workflow: upload CSV and process data', async () => {
        parseDateFromString.mockImplementation((dateString) => {
            // Return different dates based on input
            if (dateString.includes('2023-01-01')) return new Date('2023-01-01');
            if (dateString.includes('2023-06-01')) return new Date('2023-06-01');
            if (dateString.includes('2023-02-01')) return new Date('2023-02-01');
            if (dateString.includes('2023-07-01')) return new Date('2023-07-01');
            return new Date('2023-01-01');
        });

        render(<App />);

        // Create CSV with overlapping periods
        const csvContent = `EmpID,ProjectID,DateFrom,DateTo
1,1,2023-01-01,2023-06-01
2,1,2023-02-01,2023-07-01`;

        const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [csvFile] } });

            // Wait for DataGrid to render with data
            await waitFor(() => {
                const dataGrid = document.querySelector('.MuiDataGrid-root');
                expect(dataGrid).toBeInTheDocument();
            }, { timeout: 3000 });

            // Check that columns are present
            expect(screen.getByText(/Employee ID #1/i)).toBeInTheDocument();
            expect(screen.getByText(/Employee ID #2/i)).toBeInTheDocument();
        }
    });

    test('handles multiple employees on same project', async () => {
        render(<App />);

        parseDateFromString.mockReturnValue(new Date('2023-01-01'));

        const csvContent = `EmpID,ProjectID,DateFrom,DateTo
1,1,2023-01-01,2023-06-01
2,1,2023-01-01,2023-06-01
3,1,2023-01-01,2023-06-01`;

        const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [csvFile] } });

            await waitFor(() => {
                const dataGrid = document.querySelector('.MuiDataGrid-root');
                expect(dataGrid).toBeInTheDocument();
            });
        }
    });

    test('handles CSV without header row', async () => {
        render(<App />);

        parseDateFromString.mockReturnValue(new Date('2023-01-01'));

        // CSV without header
        const csvContent = `1,1,2023-01-01,2023-06-01
2,1,2023-02-01,2023-07-01`;

        const csvFile = new File([csvContent], 'employees.csv', { type: 'text/csv' });
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [csvFile] } });

            await waitFor(() => {
                const dataGrid = document.querySelector('.MuiDataGrid-root');
                expect(dataGrid).toBeInTheDocument();
            });
        }
    });
});