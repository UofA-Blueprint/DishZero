import { Button, Chip, styled } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// TODO: make these constants or create a new mui theme!
// export const DISHZERO_COLOR_DARK = '#68B49A'

/* from DIshZero image
primary
dark = #006049
main = #48b697
light = #a7ffe9

secondary (or could find a better secondary online?)
dark = #a8d2d9
main = #e8ffff
light = #ffffff

*/

/*
from https://coolors.co/68b49a
primary
dark = #4A967C
main = #68B49A
light = #89C5B0

secondary - https://coolors.co/b56983
dark = #964A65
main = #B56983
light = #C5899E

*/

export const DISHZERO_COLOR_DARK = '#006049'
export const DISHZERO_COLOR = '#48b697'
export const DISHZERO_COLOR_LIGHT = '#a7ffe9'

export const SECONDARY_DARK = '#964A65'
export const SECONDARY = '#B56983'
export const SECONDARY_LIGHT = '#C5899E'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledOutlinedButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    border: `2px solid !important`,
    padding: '0.5rem 2rem !important',
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledContainedButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    color: 'white',
    padding: '0.5rem 2rem',
    margin: '1rem',
}))

/* TODO: 
    - Check if these are duplicates?
    - Check that they are correct
    - And that they match firebase
*/

export interface Dish {
    dishId: number
    dishType: DishType
    status: DishStatus
    overdue: number
    timesBorrowed: number
    dateAdded: Date
}

export enum DishType {
    MUG = 'Mug',
    DISH = 'Dish',
}

export const DishTypeColors = {
    Mug: '#496EA5',
    Dish: '#496EA5',
}

export enum DishStatus {
    BORROWED = 'Borrowed',
    RETURNED = 'Returned',
    LOST = 'Lost',
    OVERDUE = 'Overdue',
    BROKEN = 'Broken',
}

export const DishStatusColors = {
    Borrowed: '#68B49A',
    Returned: '#29604D',
    Lost: '#BF4949',
    Overdue: '#BF4949',
    Broken: '#BF4949',
}

export const columns: GridColDef[] = [
    { field: 'dishId', headerName: 'Dish Id', width: 150 },
    {
        field: 'dishType',
        headerName: 'Dish Type',
        width: 150,
        type: 'singleSelect',
        valueOptions: Object.values(DishType) as string[],
        renderCell(params) {
            return (
                <>
                    {params && (
                        <Chip
                            variant="outlined"
                            sx={{
                                color: `${DishTypeColors[params.formattedValue] ?? 'inherit'}`,
                                border: `2px solid ${DishTypeColors[params.formattedValue] ?? 'inherit'}`,
                            }}
                            label={params.formattedValue}
                        />
                    )}
                </>
            )
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: Object.values(DishStatus) as string[],
        renderCell(params) {
            return (
                <>
                    {params && (
                        <Chip
                            variant="outlined"
                            sx={{
                                color: `${DishStatusColors[params.formattedValue] ?? 'inherit'}`,
                                border: `2px solid ${DishStatusColors[params.formattedValue] ?? 'inherit'}`,
                            }}
                            label={params.formattedValue}
                        />
                    )}
                </>
            )
        },
    },
    {
        field: 'overdue',
        headerName: 'Overdue',
        width: 150,
        renderCell(params) {
            return <>{params.row['status'] == DishStatus.OVERDUE && <>{params.formattedValue}</>}</>
        },
    },
    { field: 'timesBorrowed', headerName: 'Times Borrowed', width: 150 },
    {
        field: 'dateAdded',
        headerName: 'Date Added',
        width: 200,
        valueFormatter({ value }: { value: Date }) {
            return value.toDateString()
        },
        type: 'date',
    },
]

export const dishes: Dish[] = [
    {
        dishId: 123456785,
        dishType: DishType.DISH,
        status: DishStatus.BORROWED,
        // dishType: 'Dish',
        // status: 'Borrowed',
        overdue: 2,
        timesBorrowed: 10,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456786,
        dishType: DishType.DISH,
        status: DishStatus.RETURNED,
        overdue: 2,
        timesBorrowed: 20,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456787,
        dishType: DishType.DISH,
        status: DishStatus.LOST,
        overdue: 0,
        timesBorrowed: 100,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456788,
        dishType: DishType.MUG,
        status: DishStatus.OVERDUE,
        overdue: 0,
        timesBorrowed: 53,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456789,
        dishType: DishType.DISH,
        status: DishStatus.BROKEN,
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 545,
        dishType: DishType.MUG,
        status: DishStatus.BORROWED,
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/12/2022'),
    },
    {
        dishId: 213,
        dishType: DishType.DISH,
        status: DishStatus.OVERDUE,
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/14/2022'),
        // dateAdded: '07/14/2022',
    },
    {
        dishId: 555,
        dishType: DishType.MUG,
        status: DishStatus.RETURNED,
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/13/2023'),
    },
]
