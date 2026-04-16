import { Box, Typography } from '@mui/material';

export default function ActiveRentalTenantPage() {
  return (
    <Box
      sx={{
        bgcolor: '#eef1f2',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ fontSize: '20px', color: 'rgba(36,53,82,0.5)' }}>
        承租人資料（建置中）
      </Typography>
    </Box>
  );
}
