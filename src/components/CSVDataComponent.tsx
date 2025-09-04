import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import styled from "styled-components";
import {parseDateFromString} from "../helpers/DatetimeHelper";

interface CSVParserProps {
    employeeId: number;
    projectId: number;
    startDate: Date;
    endDate: Date;
}

type EmployeeRows = {
    id: number;
    emp1: number;
    emp2: number;
    projectId: number;
    daysWorked: number;
};

const DataGridWrapper = styled.div`
    padding: 20px;
    background-color: rgb(173, 216, 230);
`;

const CSVDataComponent = () => {
    const employeeColumns: GridColDef[] = [
        {field: "emp1", headerName: "Employee ID #1", flex: 1},
        {field: "emp2", headerName: "Employee ID #2", flex: 1},
        {field: "projectId", headerName: "Project ID", flex: 1},
        {field: "daysWorked", headerName: "Days worked", flex: 1},
    ];
    const [employeeRows, setEmployeeRows] = useState<EmployeeRows[]>([]);
    const [csvData, setCsvData] = useState<CSVParserProps[]>([]);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target?.result as string;
            if (csvText) {
                const parsedData = parseCSV(csvText);
                setCsvData(parsedData);
            }
        };
        reader.readAsText(file);
    };

    const parseCSV = (csvText: string): CSVParserProps[] => {
        const lines = csvText.split('\n').filter(line => line.trim());
        const data: CSVParserProps[] = [];

        // Skip header row if it exists
        const startIndex = lines[0].toLowerCase().includes('EmpID') ? 1 : 0;
        for (let i = startIndex; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === 4) {
                data.push({
                    employeeId: parseInt(values[0]),
                    projectId: parseInt(values[1]),
                    startDate: parseDateFromString(values[2]),
                    endDate: parseDateFromString(values[3])

                });
            }
        }
        return data;
    };

    const groupEmployeesByProjects = useMemo(() => {
        return csvData.reduce((acc, currentValue) => {
            const projectId = currentValue.projectId;

            if (!acc[projectId]) {
                acc[projectId] = [];
            }

            acc[projectId].push(currentValue);
            return acc;

        }, {} as Record<number, CSVParserProps[]>);
    }, [csvData])

    useEffect(() => {
        if (csvData.length > 0) {

            // Calculate max days worked together
            let longestPairFirstEmployee = 0;
            let longestPairSecondEmployee = 0;
            let longestPairDaysWorkedTogether = 0;
            const dataGridRows: EmployeeRows[] = [];
            let idCounter = 1;
            Object.entries(groupEmployeesByProjects).forEach(([projectId, employees]) => {
                for (let i = 0; i < employees.length; i++) {
                    for (let j = i + 1; j < employees.length; j++) {
                        if (employees[i].employeeId === employees[j].employeeId) continue;

                        const overlapStartDateInMiliseconds = Math.max(employees[i].startDate.getTime(), employees[j].startDate.getTime());
                        const overlapEndDateInMiliseconds = Math.min(employees[i].endDate.getTime(), employees[j].endDate.getTime());
                        if (overlapStartDateInMiliseconds <= overlapEndDateInMiliseconds) {
                            // The two employees are in the same project.
                            const overlapDurationInMiliseconds = overlapEndDateInMiliseconds - overlapStartDateInMiliseconds;
                            const workingDays = Math.ceil(overlapDurationInMiliseconds / (1000 * 60 * 60 * 24));
                            if (workingDays > longestPairDaysWorkedTogether) {
                                longestPairDaysWorkedTogether = workingDays;
                                longestPairFirstEmployee = employees[i].employeeId;
                                longestPairSecondEmployee = employees[j].employeeId;
                            }

                            // Add row to the data grid.
                            dataGridRows.push({
                                id: idCounter++,
                                emp1: employees[i].employeeId,
                                emp2: employees[j].employeeId,
                                projectId: +projectId,
                                daysWorked: workingDays
                            });
                        }
                    }
                }
            });
            const dataGridRowsFiltered = dataGridRows.filter(
                (employeePair) =>
                    (employeePair.emp1 === longestPairFirstEmployee && employeePair.emp2 === longestPairSecondEmployee) || (employeePair.emp1 === longestPairSecondEmployee && employeePair.emp2 === longestPairFirstEmployee)
            );
            setEmployeeRows(dataGridRowsFiltered);
        }
    }, [csvData, groupEmployeesByProjects])

    return (
        <DataGridWrapper id="data-grid-wrapper">
            <h1>Pair of employees who have worked together</h1>
            <h2>Upload a CSV file with employee data</h2>
            <input type="file"
                   id="file"
                   name="file"
                   accept=".csv"
                   onChange={handleFileUpload}
            />
            <hr/>
            <h2>
                All pairs of employees, who have worked together on at least one project will be displayed in the
                datagrid below
            </h2>
            <DataGrid rows={employeeRows}
                      columns={employeeColumns}
                      pageSizeOptions={[5, 10, 20, 30, 50, 100]}
                      initialState={{
                          pagination: {paginationModel: {pageSize: 10}},
                          sorting: {
                              sortModel: [{field: 'daysWorked', sort: 'desc'}],
                          },
                      }}
            />
        </DataGridWrapper>
    )
}


export default CSVDataComponent;