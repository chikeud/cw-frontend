import React, { useState } from 'react';
import {
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
    ThemeProvider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SharedNavBar, { NavItem } from "./components/SharedNavBar";
import DashboardIcon from "@mui/icons-material/Dashboard";
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
            const res = await fetch(`http://localhost:3000/api/cc/${bvn}`, {
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
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        How Scores Are Calculated
                                    </Typography>

                                    <Box mb={2}>
                                        <Typography variant="subtitle1" color="primary">Income Stability</Typography>
                                        <Typography variant="body2">
                                            Calculated as <code>100 - (Income Volatility × 100)</code>. Lower volatility (more stable income) leads to a higher score.
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle1" color="primary">Loan History</Typography>
                                        <Typography variant="body2">
                                            Based on the number and status of past loans. Active and repaid loans increase the score, while defaulted or written-off loans reduce it.
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle1" color="primary">Employment Score</Typography>
                                        <Typography variant="body2">
                                            If the individual is employed, score = 100. If not employed, score = 30.
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle1" color="primary">Transaction Volume</Typography>
                                        <Typography variant="body2">
                                            Based on how many transactions were observed. Fewer than 10 transactions is poor, while over 30 indicates very strong activity.
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle1" color="primary">Expense Ratio</Typography>
                                        <Typography variant="body2">
                                            The ratio of expenses to income. A low ratio (less spending relative to income) results in a higher score.
                                            <br />
                                            For example:
                                            <ul style={{marginTop: '5px'}}>
                                                <li>≤ 0.5 → Excellent (Score: 90)</li>
                                                <li>0.51 – 0.75 → Good (Score: 75)</li>
                                                <li>0.76 – 1.0 → Average (Score: 55)</li>
                                                <li>&gt; 1.0 → Poor (Score: 35)</li>
                                            </ul>

                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SmartScoreAnalysis;
