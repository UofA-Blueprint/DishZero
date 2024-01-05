/*eslint-disable*/
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    LinearProgress,
    Link,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { DISHZERO_COLOR, DISHZERO_COLOR_LIGHT, StyledContainedButton } from './constants'
import adminApi from '../adminApi'
import { useAuth } from '../../contexts/AuthContext'
import CustomDialogTitle from '../CustomDialogTitle'
import { usePreventReload } from './addNewDish'
import { useSnackbar } from 'notistack'
import { ExpandMore, FileCopyOutlined } from '@mui/icons-material'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    fetchDishes: () => void
}

// const templateFileUrl = 'https://disherzero.s3.amazonaws.com/dish_template.csv'
const templateFileUrl = ''

export default function UploadCSVDialog({ open, setOpen, fetchDishes }: Props) {
    const { sessionToken } = useAuth()

    const [error, setError] = useState<boolean>(false) // csv is not uploaded?
    const [loading, setLoading] = useState<boolean>(false)
    const [file, setFile] = useState<File>()
    const { enqueueSnackbar } = useSnackbar()

    const [summaryDialogOpen, setSummaryDialogOpen] = useState<boolean>(false) // dialog for parsing csv
    const [results, setResults] = useState<string[]>([])

    const successResults = results.filter((result) => result.startsWith('Successfully'))
    const failureResults = results.filter((result) => result.startsWith('Failed'))

    // prevent page reload when loading
    usePreventReload(loading)

    const resetState = () => {
        setError(false)
        setFile(undefined)
    }
    const [isSuccessAccordionExpanded, setIsSuccessAccordionExpanded] = useState(successResults.length > 0)
    const [isFailureAccordionExpanded, setIsFailureAccordionExpanded] = useState(failureResults.length > 0)

    const handleFile = () => {
        const reader = new FileReader()

        reader.onload = async (e) => {
            const text = e.target?.result as string
            const lines = text.split('\n')
            const header = lines[0].split(',')
            const newResults: string[] = []

            if (sessionToken) {
                setLoading(true)

                for (const line of lines.slice(1)) {
                    // Skip the header line

                    const values = line.split(',')
                    let qid: number, type: string
                    try {
                        qid = parseInt(values[header.indexOf('qid')], 10) // Parse qid as an integer
                        if (isNaN(qid)) {
                            throw new Error(`qid is not a number`)
                        }
                        type = String(values[header.indexOf('type')]) // Ensure type is a string
                    } catch (e) {
                        console.log(e)
                        newResults.push(`Failed to parse line: "${line}"; with error message: "${e}"`)
                        continue
                    }
                    const response = await adminApi.addDish(sessionToken, qid, type)
                    console.log(response)
                    if (response && response.status != 200) {
                        newResults.push(
                            `Failed to add dish: ${qid}; with error message: "${response.response.data.message}"`,
                        )
                    } else {
                        newResults.push(`Successfully added dish: ${qid}`)
                    }
                }
                setResults(newResults)
                setSummaryDialogOpen(true)

                setLoading(false)
                setOpen(false)
                resetState()

                // fetch new dishes
                fetchDishes()
            }
        }
        file && reader.readAsText(file)
    }

    return (
        <>
            <CustomDialogTitle
                open={open}
                setOpen={setOpen}
                dialogTitle={'Upload CSV'}
                loading={loading}
                onCloseCallback={resetState}>
                <DialogContent sx={{ minWidth: '520px', maxWidth: '520px' }}>
                    <Box width="100%" sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" align="left" sx={{ mb: '1.5rem' }}>
                            Upload a csv file that contains the dishes. The minimum columns needed are qid and type.
                            {'  '}
                            <Link
                                href={templateFileUrl ?? ''}
                                target="_blank"
                                color="secondary"
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                    '&:hover': {
                                        color: 'secondary.dark',
                                    },
                                }}>
                                Download Template
                            </Link>
                        </Typography>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const file = event.target.files?.[0]
                                if (file) {
                                    setFile(file)
                                }
                            }}
                            disabled={loading}
                        />
                        <StyledContainedButton
                            variant="contained"
                            onClick={() => handleFile()}
                            sx={{ width: '90%', mt: '1.5rem' }}
                            disabled={loading || error || !file}>
                            Add dishes from CSV
                        </StyledContainedButton>
                    </Box>
                    {loading && (
                        <LinearProgress
                            sx={{
                                mt: '15px',
                                backgroundColor: DISHZERO_COLOR_LIGHT,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: DISHZERO_COLOR,
                                },
                            }}
                        />
                    )}
                </DialogContent>
            </CustomDialogTitle>

            <Dialog open={summaryDialogOpen}>
                <DialogContent sx={{ minWidth: '400px', maxWidth: '800px' }}>
                    <Box width="100%" sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: '0.5em' }}>
                            Successfully Added {successResults.length} out of {results.length} dishes
                        </Typography>
                        <Accordion
                            expanded={isSuccessAccordionExpanded}
                            onChange={(event, isExpanded) => setIsSuccessAccordionExpanded(isExpanded)}>
                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ color: 'success.main' }}>
                                <Typography>Successes</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    sx={{
                                        height: '9em',
                                        overflow: 'auto',
                                        border: '1px solid',
                                        borderColor: 'success.main',
                                        p: 1,
                                    }}>
                                    <Typography style={{ whiteSpace: 'pre-line' }} align="left">
                                        {successResults.join('\n')}
                                    </Typography>
                                </Box>
                                <Tooltip title="Copy to clipboard">
                                    <span>
                                        <IconButton
                                            disabled={successResults.length === 0}
                                            color="secondary"
                                            onClick={() => {
                                                navigator.clipboard.writeText(successResults.join('\n'))
                                                enqueueSnackbar('Success results copied to clipboard', {
                                                    variant: 'success',
                                                })
                                            }}
                                            sx={{ mt: '0.5em' }}>
                                            <FileCopyOutlined />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion
                            expanded={isFailureAccordionExpanded}
                            onChange={(event, isExpanded) => setIsFailureAccordionExpanded(isExpanded)}>
                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ color: 'error.main' }}>
                                <Typography>Failures</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    sx={{
                                        height: '9em',
                                        overflow: 'auto',
                                        border: '1px solid',
                                        borderColor: 'error.main',
                                        p: 1,
                                    }}>
                                    <Typography style={{ whiteSpace: 'pre-line' }} align="left">
                                        {failureResults.join('\n')}
                                    </Typography>
                                </Box>
                                <Tooltip title="Copy to clipboard">
                                    <span>
                                        <IconButton
                                            disabled={failureResults.length === 0}
                                            color="secondary"
                                            onClick={() => {
                                                navigator.clipboard.writeText(failureResults.join('\n'))
                                                enqueueSnackbar('Failure results copied to clipboard', {
                                                    variant: 'success',
                                                })
                                            }}
                                            sx={{ mt: '0.5em' }}>
                                            <FileCopyOutlined />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </AccordionDetails>
                        </Accordion>
                        <StyledContainedButton
                            variant="contained"
                            onClick={() => {
                                setSummaryDialogOpen(false)
                                setResults([])
                            }}
                            sx={{ width: '90%', mt: '1.5em' }}
                            disabled={loading}>
                            Done
                        </StyledContainedButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}
