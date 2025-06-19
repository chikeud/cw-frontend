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
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
    const [expanded, setExpanded] = useState(true);
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
                                                    : scoreData.riskLevel === 'high'
                                                        ? 'error.main'
                                                        : 'text.secondary'
                                        }
                                    >
                                        {scoreData.riskLevel?.toUpperCase() ?? 'UNKNOWN'}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {scoreData.breakdown && (
                                <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ borderRadius: '20px' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">Score Breakdown</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List dense>
                                            {Object.entries(scoreData.breakdown).map(([key, val]) => (
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
                            )}
                        </Box>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SmartScoreAnalysis;
