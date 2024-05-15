import { CircularProgress, Box } from '@mui/material';

export default function LoadingScreen() {
    return (
        <div className="loading-screen" style={{ paddingTop: '30vh' }}>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>
    )
}