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
import type { MouseEventHandler } from 'react';
import type { IconType } from 'react-icons';
import {
  MdGroups,
  MdConstruction,
  MdDescription,
  MdHomeWork,
  MdHandshake,
  MdPeopleAlt,
  MdBusinessCenter,
  MdBarChart,
  MdManageAccounts,
  MdSettings,
  MdPerson,
} from 'react-icons/md';

const navItems: { label: string; path?: string; icon: IconType }[] = [
  { label: '開發', icon: MdConstruction },
  { label: '謄本', icon: MdDescription },
  { label: '物件', icon: MdHomeWork },
  { label: '客戶', icon: MdPeopleAlt },
  { label: '經營', icon: MdBusinessCenter },
  { label: '統計', icon: MdBarChart },
  { label: '管理', icon: MdManageAccounts },
  { label: '系統', icon: MdSettings },
];

const rentalMenuItems = [
  { label: '委託出租物件', path: '/properties' },
  { label: '出租中物件', path: '/active-rentals' },
];

function TopNavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: IconType;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      onClick={onClick}
      sx={{
        minWidth: 'auto',
        height: '37px',
        px: '16px',
        py: '8px',
        borderRadius: '8px',
        gap: 1,
        color: '#124a57',
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: 1,
        bgcolor: active ? 'rgba(18,74,87,0.1)' : 'transparent',
        '&:hover': { bgcolor: 'rgba(18,74,87,0.12)' },
      }}
    >
      <Icon size={16} />
      {label}
    </Button>
  );
}

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
          bgcolor: '#eef1f2',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important', px: '22px !important', py: '11px !important', gap: 2 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '26px', mr: 2, flexShrink: 0 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '26px',
                lineHeight: 1,
                color: '#31a0e8',
                whiteSpace: 'nowrap',
                fontFamily: '"Noto Sans TC", sans-serif',
              }}
            >
              住通房管
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '27px',
              }}
            >
              <MdGroups size={16} color="#124a57" />
              <Typography sx={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: 'rgba(36,53,82,0.6)', whiteSpace: 'nowrap' }}>
                12人在線
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, minWidth: 0, overflowX: 'auto' }}>
            {navItems.map((item) => (
              <TopNavButton
                key={item.label}
                label={item.label}
                icon={item.icon}
                onClick={item.path ? () => navigate(item.path!) : undefined}
              />
            ))}

            {/* 包租代管 Dropdown */}
            <TopNavButton
              label="包租代管"
              icon={MdHandshake}
              active={isRentalActive}
              onClick={handleRentalMenuOpen}
            />

            <Menu
              anchorEl={anchorEl}
              open={isRentalMenuOpen}
              onClose={handleRentalMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
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
                      fontWeight: 500,
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
                width: 38,
                height: 38,
                ml: 1,
                bgcolor: '#81d394',
                color: '#124a57',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              <MdPerson size={20} />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Box sx={{ pt: '70px', flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
