import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField,
    Button, CircularProgress, List, Accordion,
    AccordionSummary, AccordionDetails, useMediaQuery,
    createTheme, ThemeProvider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    PieChart, Pie, Cell,
    ResponsiveContainer
} from 'recharts';
import {useNavigate} from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SharedNavBar from './components/SharedNavBar.tsx';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#fff', secondary: '#aaa' },
    },
});

const navItems = [
    { label: 'CreditChecc', icon: <DashboardIcon />, href: '/cc' },
    { label: 'Risk', icon: <VerifiedUserIcon />, href: '/risk' },
    { label: 'KYC Verify', icon: <BadgeIcon />, href: '/kyc' },
    { label: 'Demo Users', icon: <MenuBookIcon />, href: '/data' },
    { label: 'Credit Builder', icon: <MenuBookIcon />, href: '/pfm' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

function SmartFinanceContent() {
    const [bvn, setBvn] = useState('');
    const [submittedBvn, setSubmittedBvn] = useState('');
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [savingGoal, setSavingGoal] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [borrowAmt, setBorrowAmt] = useState('');
    const [expandedLoan, setExpandedLoan] = useState(null);
    const [tabValue, setTabValue] = useState(4);
    const [mobileOpen, setMobileOpen] = useState(false);

    const fetchData = async (bvnValue) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/pfm/${bvnValue}`);
            const json = await res.json();
            setData(json);
            setError('');
        } catch (e) {
            console.error(e);
            setError('Failed loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleViewInsights = () => {
        setSubmittedBvn(bvn); // Triggers useEffect
    };

    useEffect(() => {
        if (submittedBvn) fetchData(submittedBvn);
    }, [submittedBvn]);

    const handlePlan = async () => {
        try {
            await fetch('http://localhost:3000/api/pfm/savings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bvn: submittedBvn,
                    goal_amount: parseFloat(savingGoal),
                    target_date: targetDate
                })
            });
            fetchData(submittedBvn);
        } catch (e) {
            console.error('Failed to create savings plan:', e);
        }
    };

    const handleBorrow = async () => {
        try {
            await fetch('http://localhost:3000/api/pfm/credit-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bvn: submittedBvn,
                    borrowed_amount: parseFloat(borrowAmt)
                })
            });
            fetchData(submittedBvn);
        } catch (e) {
            console.error('Failed to borrow:', e);
        }
    };

    const handleRepay = async (loanId) => {
        try {
            await fetch(`http://localhost:3000/api/credit-builder/${loanId}/repay`, {
                method: 'POST'
            });
            fetchData(submittedBvn);
        } catch (e) {
            console.error('Repayment failed:', e);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box px={2} py={4}>
                <SharedNavBar
                    navItems={navItems}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    title="Credit Builder"
                />

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6">Enter BVN to View PFM Insights</Typography>
                    <TextField
                        label="BVN"
                        value={bvn}
                        onChange={e => setBvn(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Button variant="contained" onClick={handleViewInsights} sx={{ mt: 2 }}>
                        View Insights
                    </Button>
                </Paper>

                {loading && <CircularProgress />}
                {error && <Typography color="error">{error}</Typography>}

                {data && (
                    <>
                        {/* === Saving Plan === */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6">Saving Plan</Typography>
                            {data.plan ? (
                                <>
                                    <Typography>🎯 Goal: ₦{data.plan.goal_amount}</Typography>
                                    <Typography>💰 Saved: ₦{data.plan.saved_amount}</Typography>
                                    <Typography>📅 Target Date: {data.plan.target_date}</Typography>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        label="Goal Amount (₦)"
                                        value={savingGoal}
                                        onChange={e => setSavingGoal(e.target.value)}
                                        fullWidth sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        label="Target Date"
                                        type="date"
                                        value={targetDate}
                                        onChange={e => setTargetDate(e.target.value)}
                                        fullWidth sx={{ mt: 2 }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={handlePlan}>
                                        Create Savings Plan
                                    </Button>
                                </>
                            )}
                        </Paper>

                        {/* === Credit Builder Loans === */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6">Credit Builder</Typography>

                            <TextField
                                label="Borrow Amount (₦)"
                                value={borrowAmt}
                                onChange={e => setBorrowAmt(e.target.value)}
                                fullWidth sx={{ mt: 2 }}
                            />
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handleBorrow}>
                                Borrow
                            </Button>

                            {data.loans?.length > 0 && (
                                <List>
                                    {data.loans.map(loan => (
                                        <Accordion
                                            key={loan.id}
                                            expanded={expandedLoan === loan.id}
                                            onChange={() => setExpandedLoan(expandedLoan === loan.id ? null : loan.id)}
                                            sx={{ mt: 2 }}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>
                                                    Loan ₦{loan.borrowed_amount} — Due {loan.due_date}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>Repaid: {loan.repaid ? '✅ Yes' : '❌ No'}</Typography>
                                                {!loan.repaid && (
                                                    <Button onClick={() => handleRepay(loan.id)} sx={{ mt: 1 }}>
                                                        Mark as Repaid
                                                    </Button>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </List>
                            )}
                        </Paper>

                        {/* === Category Spend Pie Chart === */}
                        {data.category_spend?.length > 0 && (
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6">Spend by Category (Last Month)</Typography>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={data.category_spend}
                                            dataKey="amount"
                                            nameKey="category"
                                            outerRadius="70%"
                                        >
                                            {data.category_spend.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        )}
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
}


export default SmartFinanceContent;
