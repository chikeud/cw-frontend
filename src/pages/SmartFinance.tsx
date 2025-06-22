import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField,
    Button, CircularProgress, Card,
    CardContent, List, ListItem,
    ListItemText, Accordion, AccordionSummary,
    AccordionDetails, createTheme,
    ThemeProvider, useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    PieChart, Pie, Cell,
    ResponsiveContainer
} from 'recharts';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#fff', secondary: '#aaa' },
    },
});

function SmartFinanceContent({ accountId }) {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [savingGoal, setSavingGoal] = useState('');
    const [borrowAmt, setBorrowAmt] = useState('');
    const [expandedLoan, setExpandedLoan] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/pfm/${accountId}`);
            const json = await res.json();
            setData(json);
        } catch (e) {
            setError('Failed loading data');
        } finally { setLoading(false); }
    };

    const handlePlan = async () => { /* POST saving plan */ fetchData(); };
    const handleBorrow = async () => { /* POST borrow */ fetchData(); };
    const handleRepay = async (loanId) => { /* POST repay */ fetchData(); };

    useEffect(fetchData, [accountId]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return data && (
        <ThemeProvider theme={darkTheme}>
            <Box px={2} py={4}>
                {/* Saving Plan */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6">Saving Plan</Typography>
                    {data.plan ? (
                        <>
                            <Typography>Goal: ₦{data.plan.goal_amount}</Typography>
                            <Typography>Saved: ₦{data.plan.saved_amount}</Typography>
                            <Typography>Target: {data.plan.target_date}</Typography>
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Goal Amount"
                                value={savingGoal}
                                onChange={e => setSavingGoal(e.target.value)}
                                fullWidth sx={{ mt: 2 }}
                            />
                            <TextField
                                label="Target Date"
                                type="date"
                                value={data.plan?.target_date || ''}
                                onChange={e => {/* handle */}}
                                fullWidth sx={{ mt: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button variant="contained" sx={{ mt: 2 }} onClick={handlePlan}>
                                Create Plan
                            </Button>
                        </>
                    )}
                </Paper>

                {/* Credit-Builder Loans */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6">Credit Builder</Typography>
                    <TextField
                        label="Borrow Amount"
                        value={borrowAmt}
                        onChange={e => setBorrowAmt(e.target.value)}
                        fullWidth sx={{ mt: 2 }}
                    />
                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleBorrow}>
                        Borrow
                    </Button>
                    {data.loans.length > 0 && (
                        <List>
                            {data.loans.map(loan => (
                                <Accordion
                                    key={loan.id}
                                    expanded={expandedLoan === loan.id}
                                    onChange={() => setExpandedLoan(expandedLoan === loan.id ? null : loan.id)}
                                    sx={{ mt: 2 }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Loan ₦{loan.borrowed_amount} due {loan.due_date}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>Repaid: {loan.repaid ? 'Yes' : 'No'}</Typography>
                                        {!loan.repaid && (
                                            <Button onClick={() => handleRepay(loan.id)}>Mark as Repaid</Button>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </List>
                    )}
                </Paper>

                {/* Category Spend Pie Chart */}
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
            </Box>
        </ThemeProvider>
    );
}

export default SmartFinanceContent;
