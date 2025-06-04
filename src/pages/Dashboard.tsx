// Dashboard.tsx
import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
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
    bvn: { bvn: string; birthdate: string; phone: string; };
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

    const getStateColor = (state: string) => {
        switch (state.toLowerCase()) {
            case 'complete':
                return 'success';
            case 'failed':
                return 'error';
            case 'review':
                return 'warning';
            case 'pending':
            default:
                return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'warning';
            case 'unverified':
            default:
                return 'default';
        }
    };

    const randomAvatarUrl = `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`;

    return (
        <>
            <SharedNavBar
                navItems={navItems}
                tabValue={tabValue}
                setTabValue={setTabValue}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                title="Verify BVN"
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
                                    shrink: true,
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
                        <Card
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: 'background.paper',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                mt: 3,
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar src={randomAvatarUrl} sx={{ width: 72, height: 72 }} />
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        {kyc.fullName}
                                    </Typography>
                                    <Typography><strong>BVN:</strong> {kyc.bvn.bvn}</Typography>
                                    <Typography><strong>Date of Birth:</strong> {kyc.dob}</Typography>
                                    <Typography><strong>Phone Number:</strong> {kyc.bvn.phone}</Typography>
                                    <Box mt={1}>
                                        <Chip
                                            label={`Status: ${kyc.verified.status}`}
                                            color={getStatusColor(kyc.verified.status)}
                                        />
                                    </Box>
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
