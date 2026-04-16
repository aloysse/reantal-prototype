import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { MdPeople } from 'react-icons/md';

const navItems = [
  { label: '開發', path: null },
  { label: '謄本', path: null },
  { label: '物件', path: null },
  { label: '客戶', path: null },
  { label: '經管', path: null },
  { label: '統計', path: null },
  { label: '管理', path: null },
  { label: '系統', path: null },
];

const rentalMenuItems = [
  { label: '委託出租物件', path: '/properties' },
  { label: '出租中物件', path: '/active-rentals' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isRentalMenuOpen = Boolean(anchorEl);
  const isRentalActive = location.pathname === '/active-rentals' || location.pathname === '/properties';

  const handleRentalMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRentalMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRentalMenuSelect = (path: string) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#eef1f2' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#124a57',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important', px: '24px !important', gap: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                letterSpacing: '0.05em',
              }}
            >
              住通房管
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: '12px',
                px: 1,
                py: 0.25,
              }}
            >
              <MdPeople size={14} color="#a0d4a8" />
              <Typography sx={{ fontSize: '12px', color: '#a0d4a8', whiteSpace: 'nowrap' }}>
                12人在線
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={item.path ? () => navigate(item.path!) : undefined}
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                  fontWeight: 400,
                  px: 1.5,
                  py: 0.75,
                  minWidth: 'auto',
                  borderRadius: '6px',
                  '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* 包租代管 Dropdown */}
            <Button
              onClick={handleRentalMenuOpen}
              sx={{
                color: isRentalActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                fontSize: '14px',
                fontWeight: isRentalActive ? 600 : 400,
                px: 1.5,
                py: 0.75,
                minWidth: 'auto',
                borderRadius: '6px',
                bgcolor: isRentalActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              包租代管
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={isRentalMenuOpen}
              onClose={handleRentalMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 0.5,
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: '160px',
                  },
                },
              }}
            >
              {rentalMenuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleRentalMenuSelect(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    fontSize: '14px',
                    color: '#124a57',
                    py: 1,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(49,160,232,0.12)',
                      color: '#31a0e8',
                      fontWeight: 600,
                    },
                    '&:hover': { bgcolor: 'rgba(49,160,232,0.08)' },
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Avatar */}
            <Avatar
              sx={{
                width: 32,
                height: 32,
                ml: 1,
                bgcolor: '#31a0e8',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              管
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Box sx={{ pt: '56px', flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
