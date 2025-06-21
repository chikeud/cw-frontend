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
    { label: 'Demo Users', icon: <MenuBookIcon />, href: '/data' },
];

const TestCredentials = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(3);
    const [mobileOpen, setMobileOpen] = useState(false);


    return (
        <ThemeProvider theme={darkTheme}>
            <SharedNavBar
                navItems={navItems}
                tabValue={tabValue}
                setTabValue={setTabValue}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                title="Demo Users"
            />

            <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
                <Container maxWidth="sm">
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Card sx={{ borderRadius: '20px' }}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">Test Users</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>

                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography color="primary">Risk</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2">
                                                   Enter account number of user to analyze.
                                                    <br />
                                                    Samples:
                                                    <ul style={{ marginTop: '5px' }}>
                                                        <li>1000000001</li>
                                                        <li>1000000002</li>
                                                        <li>1000000003</li>
                                                        <li>1000000004</li>
                                                    </ul>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography color="primary">CreditChecc</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2">
                                                    Enter bvn of user to analyze.
                                                    <br />
                                                    Samples:
                                                    <ul style={{marginTop: '5px'}}>
                                                        <li>56473829102</li>
                                                        <li>10293847566</li>
                                                        <li>93847561029</li>
                                                        <li>84736291847</li>
                                                        <li>95888168924</li>
                                                    </ul>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography color="primary">KYC Verify</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2">
                                                    Enter sample details of user to analyze.
                                                    <br />
                                                    Samples:
                                                    <ul style={{marginTop: '5px'}}>
                                                        <li>56473829102 Ethan Williams 30/08/1985</li>
                                                        <li>10293847566 Diana Brown 15/03/1992</li>
                                                        <li>93847561029 Carlos Smith 23/11/1990</li>
                                                        <li>84736291847 Alice Johnson 12/05/1988</li>
                                                        <li>95888168924 Bunch Dillon 07/07/1995</li>
                                                    </ul>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </AccordionDetails>
                                </Accordion>
                            </Card>

                        </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default TestCredentials;
