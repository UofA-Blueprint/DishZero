import { Button, Chip, styled } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export type Dish = {
    id: string
    qid: number
    type: string
    status: DishStatus // update DishStatus enum
    condition?: DishCondition // keep this for now
    timesBorrowed: number
    registered: string
    userId: string | null
    borrowedAt: string | null // rename to dateBorrowed?
    // notes: string | null // use to add notes to dish -> future work?
}

export enum DishStatus {
    borrowed = 'borrowed',
    available = 'available',
    overdue = 'overdue',
    broken = 'broken',
    lost = 'lost',
    unavailable = 'unavailable',
}

export enum DishCondition {
    smallChip = 'small_crack_chip',
    largeCrack = 'large_crack_chunk',
    shattered = 'shattered',
    good = 'good',
}

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

export const DishTypeColors = {
    mug: '#496EA5',
    dish: '#496EA5',
}

export const DishStatusColors = {
    borrowed: '#68B49A',
    available: '#29604D',
    lost: '#BF4949',
    overdue: '#BF4949',
    broken: '#BF4949',
    unavailable: '#BF4949',
}

export const DishConditionColors = {
    good: '#68B49A',
    small_crack_chip: '#BF4949',
    large_crack_chunk: '#BF4949',
    shattered: '#BF4949',
}

export const generateColumns = (dishTypes: string[]): GridColDef[] => [
    { field: 'qid', headerName: 'Dish Id', minWidth: 100, maxWidth: 100, flex: 1 },
    {
        field: 'type',
        headerName: 'Dish Type',
        minWidth: 100,
        maxWidth: 150,
        flex: 1,
        type: 'singleSelect',
        valueOptions: Object.values(dishTypes) as string[],
        valueFormatter({ value }: { value: string }) {
            return capitalizeFirstLetter(value)
        },
        renderCell(params) {
            return (
                <>
                    {params && (
                        <Chip
                            variant="outlined"
                            sx={{
                                color: `${DishTypeColors[params.value] ?? 'inherit'}`,
                                border: `2px solid ${DishTypeColors[params.value] ?? 'inherit'}`,
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
        minWidth: 150,
        maxWidth: 150,
        flex: 1,
        editable: true,
        type: 'singleSelect',
        valueOptions: Object.values(DishStatus) as string[],
        valueFormatter({ value }: { value: string }) {
            return capitalizeFirstLetter(value)
        },
        renderCell(params) {
            return (
                <>
                    {params && (
                        // TODO: add a border here same as the role from users page!
                        <Chip
                            variant="outlined"
                            sx={{
                                color: `${DishStatusColors[params.value] ?? 'inherit'}`,
                                border: `2px solid ${DishStatusColors[params.value] ?? 'inherit'}`,
                            }}
                            label={params.formattedValue}
                        />
                    )}
                </>
            )
        },
    },
    { field: 'userId', headerName: 'Current User', minWidth: 200, maxWidth: 250, flex: 1 },
    {
        field: 'borrowedAt',
        headerName: 'Date Borrowed',
        minWidth: 150,
        maxWidth: 250,
        flex: 1,
        valueFormatter({ value }: { value: string }) {
            return value ? new Date(value).toLocaleDateString() : null
        },
        renderCell(params) {
            return (
                <>
                    {params && params.formattedValue && (
                        <div
                            style={{
                                color:
                                    new Date().getTime() - new Date(params.value).getTime() > 48 * 60 * 60 * 1000
                                        ? '#BF4949'
                                        : 'inherit',
                            }}>
                            {params.formattedValue}
                        </div>
                    )}
                </>
            )
        },
    },
    {
        field: 'timesBorrowed',
        headerName: 'Times Borrowed',
        minWidth: 100,
        maxWidth: 150,
        flex: 1,
    },
    {
        field: 'registered',
        headerName: 'Date Added',
        minWidth: 150,
        maxWidth: 250,
        flex: 1,
        valueFormatter({ value }: { value: string }) {
            return new Date(value).toLocaleDateString()
        },
    },
]
