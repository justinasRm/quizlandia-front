import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { authWithGoogle } from '../functions/authFunctions';
import { backEndpoint } from '../envs';
import { useDispatch } from 'react-redux';
import { setAuthPause } from '../authSlice';

const GoogleAuth = () => {

    const [error, setError] = useState(null);
    const [signupSuccessful, setSignupSuccessful] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountType, setAccountType] = useState('Kūrėjas');
    const [followupError, setFollowupError] = useState(null);
    const dispatch = useDispatch();


    const handleDialogClose = () => {
        if (firstName === '') {
            setFollowupError('Vardas negali būti tuščias');
            return;
        } else if (lastName === '') {
            setFollowupError('Pavardė negali būti tuščia');
            return;
        }
        fetch(backEndpoint.postUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    userID: signupSuccessful.uid,
                    name: firstName,
                    surname: lastName,
                    email: signupSuccessful.email,
                    accountType: accountType === 'Kūrėjas' ? 0 : 1,
                }
            )
        }).catch((error) => {
            console.error('Error signing in:', error);
        }).then((response) => {
            if (response.status === 409) {
                setFollowupError('Toks vartotojas jau egzistuoja');
                return;
            } else if (response.status !== 201) {
                setFollowupError('Nepavyko sukurti paskyros');
                return;
            } else {
                setSignupSuccessful(false);
                dispatch(setAuthPause(false));
                window.location.reload();
            }
        })
    };


    async function authenticate() {
        const authObj = await authWithGoogle(dispatch);
        if (!authObj) {
            setError('Nepavyko prisijungti');
        }else if (authObj.error) {
            setError(authObj.error);
            return;
        } else if (authObj.displayAdditionalInfo) {
            setSignupSuccessful(authObj);
        } else {
            dispatch(setAuthPause(false));
            window.location.reload();
        }
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={authenticate}>Google autentifikacija</Button>
            {error && <text style={{ color: 'red', textAlign: 'center' }}>{error}</text>}
                <Dialog open={signupSuccessful} onClose={handleDialogClose}>
        <DialogTitle>Papildoma informacija</DialogTitle>
        <DialogContent>
          <TextField
                        label="Vardas"
                        required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
                        label="Pavardė"
                        required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Paskyros tipas</InputLabel>
            <Select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <MenuItem value="Kūrėjas">Kūrėjas</MenuItem>
              <MenuItem value="Sprendėjas">Sprendėjas</MenuItem>
            </Select>
                    </FormControl>
            {followupError && <h6 style={{ color: 'red', textAlign: 'center', margin: 10, fontSize: 15 }}>{followupError}</h6>}
                    
        </DialogContent>
                <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Sukurti paskyrą
          </Button>
        </DialogActions>
      </Dialog>
        </div>

    );
};

export default GoogleAuth;