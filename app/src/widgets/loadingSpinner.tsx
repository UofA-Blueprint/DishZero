import { Box } from '@mui/material'
import { styles } from '../routes/login'
import { BallTriangle } from 'react-loader-spinner'

interface Props {
    isMobile: boolean
}

export default function LoadingSpinner({ isMobile }: Props) {
    return (
        <Box sx={isMobile ? styles.rootMobileLoader : styles.rootDesktop}>
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#4fa94d"
                ariaLabel="ball-triangle-loading"
                visible={true}
            />
        </Box>
    )
}
