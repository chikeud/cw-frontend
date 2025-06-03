// components/SharedNavBar.tsx
import React from 'react';
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List as MuiList,
    ListItemButton,
    ListItemIcon,
    ListItemText as MuiListItemText,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export type NavItem = {
    label: string;
    icon: React.ReactElement;
    href: string;
};

type Props = {
    navItems: NavItem[];
    tabValue: number;
    setTabValue: (value: number) => void;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
    title: string;
};

export default function SharedNavBar({
                                         navItems,
                                         tabValue,
                                         setTabValue,
                                         mobileOpen,
                                         setMobileOpen,
                                         title,
                                     }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        const href = navItems[newValue]?.href;
        if (href) navigate(href);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ width: 250, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menu
            </Typography>
            <MuiList>
                {navItems.map(({ label, icon, href }) => (
                    <ListItemButton key={label} component="a" href={href}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <MuiListItemText primary={label} />
                    </ListItemButton>
                ))}
            </MuiList>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                            aria-label="open drawer"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    {!isMobile && (
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            textColor="inherit"
                            indicatorColor="secondary"
                        >
                            {navItems.map(({ label }) => (
                                <Tab key={label} label={label} />
                            ))}
                        </Tabs>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </>
    );
}
