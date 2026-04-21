import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  /** 綠色款（社宅專用），預設 false（藍色款） */
  green?: boolean;
  /** 預設展開狀態，預設 true */
  defaultExpanded?: boolean;
}

export default function SectionCard({
  title,
  children,
  green = false,
  defaultExpanded = true,
}: SectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const accentColor = green ? '#81d394' : '#31a0e8';

  return (
    <Box
      sx={{
        p: 8,
        borderRadius: '16px',
        boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
        bgcolor: green ? '#fafffb' : '#fafafa',
        border: green ? '1px solid #81d394' : 'none',
        width: '100%',
      }}
    >
      {/* 標題列 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 3 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: `8px solid ${accentColor}`, pl: 2 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57', lineHeight: 1.167 }}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(v => !v)} sx={{ color: 'rgba(36,53,82,0.5)' }}>
          {expanded ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </IconButton>
      </Box>

      {expanded && children}
    </Box>
  );
}
