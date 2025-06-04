import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    createTheme,
    ThemeProvider,
    useMediaQuery,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container,
    Tabs,
    Tab,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

import SharedNavBar from './components/SharedNavBar.tsx';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#fff',
            secondary: '#aaa',
        },
    },
});

const navItems = [
    { label: 'CreditChecc', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Risk', icon: <VerifiedUserIcon />, href: '/risk' },
    { label: 'KYC Verify', icon: <BadgeIcon />, href: '/kyc' },
];

function RiskAnalysisContent() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');

    const [accountId, setAccountId] = useState('');
    const [riskData, setRiskData] = useState(null);
    const [scoringData, setScoringData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(1);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleFetch = async () => {
        if (!accountId.trim()) return;
        setLoading(true);
        setError('');
        setRiskData(null);
        setScoringData(null);

        try {
            const riskRes = await fetch(`http://localhost:3000/api/risk/${accountId}`, {
                headers: { Authorization: 'Bearer-1509' },
            });
            if (!riskRes.ok) throw new Error('Failed to fetch risk data');
            const riskJson = await riskRes.json();
            setRiskData(riskJson);

            const scoreRes = await fetch(`http://localhost:3000/api/scoring/${accountId}`, {
                headers: { Authorization: 'Bearer-1509' },
            });
            if (!scoreRes.ok) throw new Error('Failed to fetch scoring data');
            const scoreJson = await scoreRes.json();
            setScoringData(scoreJson);
        } catch (err) {
            setError('Could not retrieve risk or scoring data.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFetch();
        }
    };

    const pieData = riskData
        ? [
            { name: 'Gambling Tx', value: riskData.gamblingTxCount },
            { name: 'Large Credits', value: riskData.largeCashCreditsCount },
            { name: 'Reversals', value: riskData.reversalsCount },
        ]
        : [];

    const barData = riskData
        ? [
            {
                name: 'Transactions',
                Credits: riskData.totalCredits,
                Debits: riskData.totalDebits,
            },
        ]
        : [];

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const href = navItems[newValue]?.href;
        if (href) {
            navigate(href);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    overflowY: isMobile ? 'auto' : 'visible',
                    backgroundColor: 'background.default',
                }}
            >
                <SharedNavBar
                    navItems={navItems}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    title="Client Risk Analysis"
                />

                <Container maxWidth="lg">
                    <Box px={2} py={4}>
                        <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                            <form onSubmit={(e) => { e.preventDefault(); handleFetch(); }}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    autoComplete="off"
                                />
                                <Box mt={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={handleFetch}
                                        disabled={loading || !accountId.trim()}
                                        size="large"
                                        type="submit"
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Analyze Risk'}
                                    </Button>
                                </Box>
                                {error && (
                                    <Typography color="error" mt={2} textAlign="center">
                                        {error}
                                    </Typography>
                                )}
                            </form>
                        </Paper>

                        {(riskData || scoringData) && (
                            <>
                                <Box
                                    display="flex"
                                    flexDirection={isMobile ? 'column' : 'row'}
                                    justifyContent="space-between"
                                    gap={3}
                                    mb={4}
                                >
                                    <Card sx={{ flex: 1, borderRadius: '20px' }}>
                                        <CardContent
                                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                                        >
                                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                                Surplus Income Ratio
                                            </Typography>
                                            <Typography variant="h3" color="primary">
                                                {riskData ? `${(riskData.disposableIncomeRatio * 100).toFixed(2)}%` : '—'}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ flex: 1, borderRadius: '20px' }}>
                                        <CardContent
                                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                                        >
                                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                                Overall Risk Score
                                            </Typography>
                                            <Typography variant="h3" color="primary">
                                                {scoringData?.score ?? '—'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Grid container spacing={4}>
                                    {riskData && (
                                        <Grid item xs={12} sm={6}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="h6">Credit vs Debit</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <BarChart data={barData} barGap={10}>
                                                            <XAxis dataKey="name" stroke="#aaa" />
                                                            <YAxis stroke="#aaa" />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: '#2c2c2c',
                                                                    border: '1px solid #444',
                                                                    color: '#fff',
                                                                }}
                                                            />
                                                            <Legend />
                                                            <Bar dataKey="Credits" fill="#4caf50" barSize={20} />
                                                            <Bar dataKey="Debits" fill="#f44336" barSize={20} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    )}

                                    {scoringData && (
                                        <Grid item xs={12} sm={6}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="h6">Scoring Breakdown</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <List dense>
                                                        {Object.entries(scoringData.breakdown).map(([key, val]) => (
                                                            <ListItem key={key}>
                                                                <ListItemText
                                                                    primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                                                    secondary={`Score: ${val}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    )}

                                    {riskData && (
                                        <Grid item xs={12} sm={6}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="h6">Risk Indicators</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Box display="flex" flexWrap="wrap" mb={2} gap={2}>
                                                        {pieData.map((entry, index) => (
                                                            <Box key={entry.name} display="flex" alignItems="center" gap={1}>
                                                                <Box
                                                                    sx={{
                                                                        width: 14,
                                                                        height: 14,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: COLORS[index % COLORS.length],
                                                                    }}
                                                                />
                                                                <Typography variant="body2">{entry.name}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={pieData}
                                                                dataKey="value"
                                                                nameKey="name"
                                                                outerRadius="70%"
                                                                stroke="#1e1e1e"
                                                                strokeWidth={2}
                                                            >
                                                                {pieData.map((entry, index) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={COLORS[index % COLORS.length]}
                                                                    />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: '#2c2c2c',
                                                                    border: '1px solid #444',
                                                                    color: '#fff',
                                                                }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <Accordion defaultExpanded={!isMobile}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="h6">Scoring Explanation</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Gambling Score"
                                                            secondary="2 or more gambling transactions = 0 points, 1 = 10 points, 0 = 20 points"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Disposable Income Score"
                                                            secondary="Full score (25) if total credits are significantly more than debits; lower otherwise"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Large Cash Credits Penalty"
                                                            secondary="0 entries = 15 points, 1–2 entries = 10 points, >2 = 5 points"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Reversals Penalty"
                                                            secondary="Same scale as Large Cash Credits Penalty"
                                                        />
                                                    </ListItem>
                                                </List>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default RiskAnalysisContent;
