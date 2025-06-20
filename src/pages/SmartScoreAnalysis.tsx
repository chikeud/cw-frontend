import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary, AccordionDetails,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Card,
    CardContent,
    Container,
    useMediaQuery,
    createTheme,
    ThemeProvider, ListItemIcon,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SharedNavBar, { NavItem } from "./components/SharedNavBar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

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

const navItems: NavItem[] = [
    { label: 'CreditChecc', icon: <DashboardIcon />, href: '/cc' },
    { label: 'Risk', icon: <VerifiedUserIcon />, href: '/risk' },
    { label: 'KYC Verify', icon: <BadgeIcon />, href: '/kyc' },
    { label: 'Test Users', icon: <MenuBookIcon />, href: '/data' },
];

const SmartScoreAnalysis = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [bvn, setbvn] = useState('');
    const [scoreData, setScoreData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleFetch = async () => {
        if (!bvn.trim()) return;
        setLoading(true);
        setError('');
        setScoreData(null);

        try {
            const res = await fetch(`https://credit-wallet-9d4e5e5f290e.herokuapp.com/api/cc/${bvn}`, {
                headers: { Authorization: 'Bearer 1509' },
            });

            if (!res.ok) throw new Error('Failed to fetch scoring data');
            const json = await res.json();
            setScoreData(json);
        } catch (err) {
            setError('Could not retrieve smart score data.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFetch();
        }
    };

    const breakdownData = scoreData?.breakdown
        ? Object.entries(scoreData.breakdown).map(([key, value]) => ({
            name: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
            score: value,
            grade:
                value >= 85
                    ? 'Excellent'
                    : value >= 70
                        ? 'Good'
                        : value >= 55
                            ? 'Average'
                            : 'Poor',
        }))
        : [];

    return (
        <ThemeProvider theme={darkTheme}>
            <SharedNavBar
                navItems={navItems}
                tabValue={tabValue}
                setTabValue={setTabValue}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                title="Get Credit Score"
            />

            <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
                <Container maxWidth="sm">
                    <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
                        <form onSubmit={(e) => { e.preventDefault(); handleFetch(); }}>
                            <TextField
                                fullWidth
                                label="BVN"
                                value={bvn}
                                onChange={(e) => setbvn(e.target.value)}
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
                                    disabled={loading || !bvn.trim()}
                                    size="large"
                                    type="submit"
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Get Smart Score'}
                                </Button>
                            </Box>
                            {error && (
                                <Typography color="error" mt={2} textAlign="center">
                                    {error}
                                </Typography>
                            )}
                        </form>
                    </Paper>

                    {scoreData && (
                        <Box display="flex" flexDirection="column" gap={3}>
                            {/* Composite Score */}
                            <Card sx={{ borderRadius: '20px' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                        Composite Score
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {scoreData.compositeScore ?? 'N/A'}
                                        <Typography variant="h6" color="primary">
                                            / 800
                                        </Typography>
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Risk Level */}
                            <Card sx={{ borderRadius: '20px' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                        Risk Level
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={
                                            scoreData.riskLevel === 'low'
                                                ? 'success.main'
                                                : scoreData.riskLevel === 'moderate'
                                                    ? 'warning.main'
                                                    : 'error.main'
                                        }
                                    >
                                        {scoreData.riskLevel?.toUpperCase() ?? 'UNKNOWN'}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Breakdown Chart */}
                            {breakdownData.length > 0 && (
                                <Card sx={{ borderRadius: '20px' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Score Breakdown
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                data={breakdownData}
                                                layout="vertical"
                                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} />
                                                <YAxis dataKey="name" type="category" width={150} />
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (!active || !payload || !payload.length) return null;
                                                        const item = payload[0].payload;
                                                        return (
                                                            <Paper sx={{ p: 1 }}>
                                                                <Typography variant="body2"><strong>{item.name}</strong></Typography>
                                                                <Typography variant="body2">Score: {item.score}</Typography>
                                                                <Typography variant="body2">Grade: {item.grade}</Typography>
                                                            </Paper>
                                                        );
                                                    }}
                                                />
                                                <Bar dataKey="score" fill="#1976d2">
                                                    <LabelList dataKey="score" position="right" fill="#fff" />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            )}
                            <Card sx={{ borderRadius: '20px' }}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">How Scores Are Calculated</Typography>
                                    </AccordionSummary>

                                <AccordionDetails>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography color="primary">Income Stability</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            This is based on how consistent the user's income is over time. It's calculated using the standard deviation of monthly income from Open Banking transaction data.
                                            <br />
                                            Steps:
                                            <ul style={{ marginTop: '5px' }}>
                                                <li>Fetch salary/income-related credit transactions over the past 6 months</li>
                                                <li>Group them by month and total each month's income</li>
                                                <li>Compute the <strong>standard deviation</strong> of the monthly values</li>
                                                <li>Divide by average income to get the <em>income volatility</em></li>
                                            </ul>
                                            Score formula: <code>100 - (Income Volatility × 100)</code>.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography color="primary">Expense Ratio</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            The ratio of expenses to income. A low ratio means better financial behavior.
                                            <ul style={{ marginTop: '5px' }}>
                                                <li>≤ 0.5 → Excellent (Score: 90)</li>
                                                <li>0.51 – 0.75 → Good (Score: 75)</li>
                                                <li>0.76 – 1.0 → Average (Score: 55)</li>
                                                <li>&gt; 1.0 → Poor (Score: 35)</li>
                                            </ul>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography color="primary">Recurring Payment Reliability</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            Measures how consistently recurring payments (like rent or utilities) succeed.
                                            <br />
                                            Score based on average success rate:
                                            <ul style={{ marginTop: '5px' }}>
                                                <li>≥ 0.95 → Excellent (Score: 90)</li>
                                                <li>0.85 – 0.94 → Good (Score: 75)</li>
                                                <li>&lt; 0.85 → Fair (Score: 60)</li>
                                            </ul>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography color="primary">Overdraft Behavior</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            Based on overdraft occurrences in the last 90 days.
                                            <ul style={{ marginTop: '5px' }}>
                                                <li>0 overdrafts → Excellent (Score: 90)</li>
                                                <li>1–2 overdrafts → Fair (Score: 70)</li>
                                                <li>3+ overdrafts → Risky (Score: 50)</li>
                                            </ul>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography color="primary">Loan Repayment Ratio</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            Measures monthly loan burden relative to income.
                                            <br />
                                            Formula: <code>loan_repayment / avg_monthly_income</code>
                                            <ul style={{ marginTop: '5px' }}>
                                                <li>≤ 0.2 → Healthy (Score: 85)</li>
                                                <li>0.21 – 0.35 → Moderate (Score: 70)</li>
                                                <li>0.36 – 0.5 → High (Score: 55)</li>
                                                <li>&gt; 0.5 → Concerning (Score: 35)</li>
                                            </ul>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography color="primary">Account Profile</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            Factors in how long the account has existed and if multiple accounts are active.
                                            <ul style={{ marginTop: '5px' }}>
                                                <li>Age ≥ 24 months → (Score: 90)</li>
                                                <li>12–23 months → (Score: 75)</li>
                                                <li>&lt; 12 months → (Score: 50)</li>
                                                <li>+10 bonus if number of accounts &gt; 1</li>
                                            </ul>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                </AccordionDetails>
                                </Accordion>
                            </Card>

                        </Box>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SmartScoreAnalysis;
