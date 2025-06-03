// Dashboard.tsx
import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Paper,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SharedNavBar, { NavItem } from './components/SharedNavBar.tsx';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const navItems: NavItem[] = [
    { label: 'CreditChecc', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Risk', icon: <VerifiedUserIcon />, href: '/risk' },
    { label: 'KYC Verify', icon: <BadgeIcon />, href: '/kyc' },
];

type KycResponse = {
    fullName: string;
    bvn: { bvn: string; birthdate: string };
    dob: string;
    verified: { state: string; status: string };
};

function DashboardContent() {
    const [form, setForm] = useState({ bvn: '', firstname: '', lastname: '', dob: '' });
    const [kyc, setKyc] = useState<KycResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(2); // KYC tab
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setKyc(null);

        //console.log(form);

        try {
            const res = await fetch('https://credit-wallet-9d4e5e5f290e.herokuapp.com/api/kyc/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer-1509',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Request failed');

            const data = await res.json();
            setKyc(data);
        } catch (err) {
            console.error(err);
                setError('Invalid/Incomplete KYC data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SharedNavBar
                navItems={navItems}
                tabValue={tabValue}
                setTabValue={setTabValue}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                title="Client KYC Dashboard"
            />

            <Box p={{ xs: 2, sm: 4 }} display="flex" flexDirection="column" alignItems="center">
                <Box width="100%" maxWidth={500}>
                    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="BVN"
                                name="bvn"
                                value={form.bvn}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstname"
                                value={form.firstname}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastname"
                                value={form.lastname}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputLabelProps={{
                                    shrink: true, // ensures label stays above the date input
                                }}
                            />
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Verify KYC'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>


                    {error && (
                        <Typography color="error" textAlign="center" mb={2}>
                            {error}
                        </Typography>
                    )}

                    {kyc && (
                        <Card elevation={3}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src="https://i.pravatar.cc/100?img=8"
                                    sx={{ width: 64, height: 64 }}
                                />
                                <Box>
                                    <Typography variant="h6">{kyc.fullName}</Typography>
                                    <Typography><strong>BVN:</strong> {kyc.bvn.bvn}</Typography>
                                    <Typography><strong>Date of Birth:</strong> {kyc.dob}</Typography>
                                    <Typography><strong>State:</strong> {kyc.verified.state}</Typography>
                                    <Typography><strong>Status:</strong> {kyc.verified.status}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default function Dashboard() {
    return (
        <ThemeProvider theme={darkTheme}>
            <DashboardContent />
        </ThemeProvider>
    );
}
