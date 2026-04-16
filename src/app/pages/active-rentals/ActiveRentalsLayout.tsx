import { useParams, useNavigate, useLocation, useSearchParams, Outlet } from 'react-router-dom';
import { Box, Fab, Typography } from '@mui/material';
import { MdArrowBack } from 'react-icons/md';
import { properties } from '../../data/mockData';
import type { PropertyType } from '../../data/mockData';

// ─── 常數 ────────────────────────────────────────────────────────────────────

const SOCIAL_STEPS = [
  { number: 1, label: '物件資料' },
  { number: 2, label: '出租人資料' },
  { number: 3, label: '屋況調查' },
  { number: 4, label: '承租人資料' },
  { number: 5, label: '契約文件' },
  { number: 7, label: '自動填表' },
];

const GENERAL_STEPS = [
  { number: 1, label: '物件資料' },
  { number: 2, label: '出租人資料' },
  { number: 4, label: '承租人資料' },
  { number: 5, label: '契約文件' },
];

const PERIOD_LABEL_MAP: Record<string, string> = {
  'p5': '社宅第五期 1150225',
  'p4-inc': '社宅第四期 (增) 1150225',
  'p4': '社宅第四期 1150202',
};

// 路徑最後一段 → 步驟編號
const SUB_PATH_TO_STEP: Record<string, number> = {
  '': 1,
  'landlord': 2,
  'inspection': 3,
  'tenant': 4,
  'contract': 5,
};

// 次導覽列高度（固定值，對應 StepsBar 高度：py:2 × 2 + minHeight:80）
const STEPS_BAR_HEIGHT = 112;

// ─── StepsBar ────────────────────────────────────────────────────────────────

function StepsBar({
  steps,
  currentStepNumber,
  periodLabel,
}: {
  steps: { number: number; label: string }[];
  currentStepNumber: number;
  periodLabel?: string | null;
}) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        minHeight: '80px',
      }}
    >
      {/* 返回按鈕 + 標題（絕對定位，左側） */}
      <Box sx={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Fab
          size="small"
          color="primary"
          onClick={() => navigate('/active-rentals')}
          sx={{
            width: 40,
            height: 40,
            minHeight: 40,
            boxShadow: '1px 1px 4px rgba(0,0,0,0.4)',
            bgcolor: '#31a0e8',
            '&:hover': { bgcolor: '#2090d8' },
          }}
        >
          <MdArrowBack size={20} />
        </Fab>
        <Box>
          <Typography sx={{ fontSize: '30px', fontWeight: 700, color: '#124a57', lineHeight: 1 }}>
            出租中物件
          </Typography>
          {periodLabel && (
            <Typography sx={{ fontSize: '12px', color: '#489e5c', lineHeight: '16px', mt: 0.5 }}>
              {periodLabel}
            </Typography>
          )}
        </Box>
      </Box>

      {/* 步驟（置中） */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {steps.map((step, i) => {
          const isActive = step.number === currentStepNumber;
          return (
            <Box key={step.number} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  width: '60px',
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isActive ? '#31a0e8' : '#ffffff',
                    boxShadow: isActive ? '1px 1px 4px rgba(0,0,0,0.4)' : 'none',
                    border: isActive ? 'none' : '2px solid rgba(36,53,82,0.2)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 500,
                      color: isActive ? '#ffffff' : 'rgba(36,53,82,0.6)',
                    }}
                  >
                    {step.number}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: isActive ? '#124a57' : 'rgba(36,53,82,0.6)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
              {i < steps.length - 1 && (
                <Box
                  sx={{
                    width: '40px',
                    height: '2px',
                    bgcolor: 'rgba(36,53,82,0.2)',
                    mb: '24px',
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function ActiveRentalsLayout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 從路徑最後一段判斷當前步驟
  const pathParts = location.pathname.split('/');
  const subPath = pathParts.length > 3 ? pathParts[3] : '';
  const currentStepNumber = SUB_PATH_TO_STEP[subPath] ?? 1;

  // 物件資料與類型
  const isNew = id === 'new';
  const property = isNew ? null : properties.find(p => p.id === id);
  const propertyType: PropertyType = isNew
    ? (searchParams.get('type') as PropertyType ?? 'social')
    : (property?.type ?? 'social');

  // 社宅期別標籤
  const periodLabel = isNew
    ? (propertyType === 'social' ? (PERIOD_LABEL_MAP[searchParams.get('period') ?? 'p5'] ?? null) : null)
    : (property?.periodLabel ?? null);

  const steps = propertyType === 'social' ? SOCIAL_STEPS : GENERAL_STEPS;

  return (
    <>
      {/* 固定次導覽列（AppBar 56px 以下） */}
      <Box
        sx={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: '#eef1f2',
          borderBottom: '1px solid rgba(36,53,82,0.1)',
        }}
      >
        <Box sx={{ maxWidth: '1584px', mx: 'auto', px: 3 }}>
          <StepsBar
            steps={steps}
            currentStepNumber={currentStepNumber}
            periodLabel={periodLabel}
          />
        </Box>
      </Box>

      {/* 內容區（補上次導覽列的高度） */}
      <Box sx={{ pt: `${STEPS_BAR_HEIGHT}px` }}>
        <Outlet />
      </Box>
    </>
  );
}
