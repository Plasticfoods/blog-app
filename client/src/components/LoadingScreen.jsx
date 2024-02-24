import { CircularProgress, Box } from '@mui/material';

export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>
    )
}