import React, { useState } from 'react';
import { TextField, Button, Dialog } from '@mui/material';
import { DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { signupUser } from '../functions/authFunctions';
import { useDispatch } from 'react-redux';

function SignUp(props) {
    const [email, setEmail] = useState('');
    const [repeatEmail, setRepeatEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);
    const [followupError, setFollowupError] = useState(null);
    const [signupSuccessful, setSignupSuccessful] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountType, setAccountType] = useState('Kūrėjas');

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const dispatch = useDispatch();

    const validate = () => {
        if (!validateEmailFormat(email)) {
            setError("Netinkamas el. pašto formatas");
            return
        } else if (email !== repeatEmail) {
            setError("El. paštai nesutampa");
            return
        } else if (password !== repeatPassword) {
            setError("Slaptažodžiai nesutampa");
            return
        } else if (password.length < 8) {
            setError("Slaptažodis turi būti bent 8 simbolių ilgio");
            return
        } else if (!/[A-Z]/.test(password)) {
            setError('Slaptažodyje turi būti bent viena didžioji raidė');
            return
        } else if (!/[a-z]/.test(password)) {
            setError('Slaptažodyje turi būti bent viena mažoji raidė');
            return
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setSignupSuccessful(true);
        }
    };

    const handleDialogClose = async () => {
        if (firstName === '') {
            setFollowupError('Vardas negali būti tuščias');
            return;
        } else if (lastName === '') {
            setFollowupError('Pavardė negali būti tuščia');
            return;
        }

       const signup = await signupUser(email, password, firstName, lastName, accountType, dispatch);
            if (signup.error) {
                setError(signup.error);
                setSignupSuccessful(false)
                return;
            } else {
                props.setUid(signup.uid);
            }

  };

    return (
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', width: '100%' }}>
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Repeat Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={repeatEmail}
                onChange={(e) => setRepeatEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="Repeat Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Registruotis
            </Button>
            <Button variant="text" color="primary" style={{ marginTop: '10px' }} onClick={() => props.setSigninFlow(true)}>
                Jau turi paskyrą? Prisijunk!
            </Button>
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
        </form>
    );
}

export default SignUp;