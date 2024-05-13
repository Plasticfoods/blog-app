import { Link } from "react-router-dom";
import { Dialog, TextField, Avatar, Button, Typography } from "@mui/material";
import { useState } from "react";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditProfile({ profile, updateUserInfo }) {
    const [open, setOpen] = useState(false)
    const [currData, setCurrentData] = useState(profile)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        handleClose()
        updateUserInfo(currData)
    }
    
    return (
        <div style={{ paddingTop: '.5rem' }}>
            <Link className="edit-profile" onClick={handleClickOpen}>Edit Profile</Link>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '.5rem' }}>
                    <Avatar>{profile.name.charAt(0)}</Avatar>
                    <p style={{ fontWeight: '600', fontSize: '1.4rem' }}>Profile Information</p>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', gap: '1rem' }}>
                    <DialogContentText>
                        Name and email address can be changed and appears on your Profile page, as your byline, and in your responses..
                    </DialogContentText>
                    <TextField
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currData.name}
                        helperText="Name should be at least 4 characters long."
                        onChange={(e) => 
                            setCurrentData({ ...currData, name: e.target.value })
                        } 
                    />
                    <TextField
                        required
                        margin="dense"
                        id="username"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currData.username}
                        helperText="Currently changes are not allowed."
                        disabled
                    />
                    <TextField
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={currData.email}
                        helperText="Your email address is not visible to the public."
                        onChange={(e) => setCurrentData({ ...currData, email: e.target.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'end', gap: '1.5rem' }}>
                        <Button onClick={() => {
                            handleClose()
                            setCurrentData(profile)
                        }} 
                        color="success" variant="outlined" sx={{ fontWeight: '500', borderRadius: '20px' }}>
                            Cancel
                        </Button>
                        <Button type="button" color="success" variant="contained" sx={{ fontWeight: '500', borderRadius: '20px' }} onClick={handleSubmit}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}