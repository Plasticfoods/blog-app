import { CircularProgress, Box } from '@mui/material';

export default function LoadingContainer() {
    return (
        <div className="loading-container">
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>    
    )
}