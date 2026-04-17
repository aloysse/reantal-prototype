import { Box, Typography, Alert } from '@mui/material';
import { MdOpenInNew } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { properties } from '../../data/mockData';

const BUTTONS = [
  { title: '住都中心',              url: 'https://houserent2.nlma.gov.tw/hurcch/login' },
  { title: '地政司 - 租賃資料登錄', url: 'https://clirland.moi.gov.tw/CAP/' },
  { title: '地政司 - 實價登錄',     url: 'https://vlir.land.moi.gov.tw/' },
];

export default function ActiveRentalAutoFillPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const property = isNew ? null : properties.find(p => p.id === id);
  const statusTags = isNew ? [{ date: '', label: 'New' }] : (property?.statusTags ?? []);

  return (
    <Box sx={{ bgcolor: '#eef1f2', pb: 12 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3, pt: 2 }}>

      {/* 狀態標籤 */}
      {statusTags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, mb: 2.5 }}>
          {statusTags.map((tag, i) => (
            <Box
              key={i}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                bgcolor: '#8dde85',
                borderRadius: '90px',
                px: 1.5,
                py: 0.25,
                minHeight: '24px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#ffffff', whiteSpace: 'nowrap' }}>
                {tag.date}{tag.date && ' '}{tag.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Box sx={{ bgcolor: '#ffffff', borderRadius: '12px', p: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

        {/* 警告提示 */}
        <Alert severity="warning" sx={{ mb: 4, fontSize: '14px' }}>
          請使用 Google Chrome 瀏覽器，並下載填充應用程式&nbsp;
          <Box
            component="a"
            href="#"
            sx={{ color: '#31a0e8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            住通房管 - 社宅通
          </Box>
        </Alert>

        {/* 三個綠色方形按鈕 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, py: 4 }}>
          {BUTTONS.map(btn => (
            <Box
              key={btn.title}
              component="a"
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: 140, height: 140,
                bgcolor: '#81d394',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                textDecoration: 'none',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.18)',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': {
                  bgcolor: '#6bc480',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.22)',
                },
              }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#fff', textAlign: 'center', lineHeight: 1.3, px: 1 }}>
                {btn.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
                  自動填表
                </Typography>
                <MdOpenInNew size={13} color="rgba(255,255,255,0.9)" />
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
      </Box>
    </Box>
  );
}
