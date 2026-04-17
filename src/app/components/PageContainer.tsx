import { Box, Container } from '@mui/material';

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: '#eef1f2', pb: 12 }}>
      <Container maxWidth={false} disableGutters sx={{ maxWidth: '1584px', px: 3, pt: 2 }}>
        {children}
      </Container>
    </Box>
  );
}
