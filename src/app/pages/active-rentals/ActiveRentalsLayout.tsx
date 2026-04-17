import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams, Outlet } from 'react-router-dom';
import { Box, Fab, Typography } from '@mui/material';
import { MdArrowBack, MdArrowBackIosNew, MdArrowForwardIos, MdArrowUpward, MdSave } from 'react-icons/md';
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

const SOCIAL_ROUTE_STEPS = [
  { path: '', label: '物件資料', showSave: true },
  { path: 'landlord', label: '出租人資料', showSave: true },
  { path: 'inspection', label: '屋況調查', showSave: false },
  { path: 'tenant', label: '承租人資料', showSave: false },
  { path: 'contract', label: '契約文件', showSave: false },
  { path: 'auto-fill', label: '自動填表', showSave: false },
];

const GENERAL_ROUTE_STEPS = [
  { path: '', label: '物件資料', showSave: true },
  { path: 'landlord', label: '出租人資料', showSave: true },
  { path: 'tenant', label: '承租人資料', showSave: false },
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
  'auto-fill': 7,
};

// 次導覽列高度（固定值，對應 StepsBar 高度：py:2 × 2 + minHeight:80）
const STEPS_BAR_HEIGHT = 112;

// ─── StepsBar ────────────────────────────────────────────────────────────────

function StepsBar({
  steps,
  currentStepNumber,
  periodLabel,
  onStepClick,
}: {
  steps: { number: number; label: string; path?: string }[];
  currentStepNumber: number;
  periodLabel?: string | null;
  onStepClick?: (path: string) => void;
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
          const isClickable = step.path !== undefined;
          return (
            <Box key={step.number} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Box
                component="button"
                type="button"
                onClick={isClickable ? () => onStepClick?.(step.path ?? '') : undefined}
                disabled={!isClickable}
                sx={{
                  p: 0,
                  m: 0,
                  border: 'none',
                  bgcolor: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  width: '60px',
                  flexShrink: 0,
                  cursor: isClickable ? 'pointer' : 'default',
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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showTopShadow, setShowTopShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopShadow(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
  const routeSteps = propertyType === 'social' ? SOCIAL_ROUTE_STEPS : GENERAL_ROUTE_STEPS;
  const stepsWithPath = steps.map((step, index) => ({ ...step, path: routeSteps[index]?.path }));
  const currentRouteStepIndex = routeSteps.findIndex(step => step.path === subPath);
  const safeCurrentIndex = currentRouteStepIndex >= 0 ? currentRouteStepIndex : 0;
  const prevRouteStep = safeCurrentIndex > 0 ? routeSteps[safeCurrentIndex - 1] : null;
  const nextRouteStep = safeCurrentIndex < routeSteps.length - 1 ? routeSteps[safeCurrentIndex + 1] : null;
  const shouldShowSave = routeSteps[safeCurrentIndex]?.showSave ?? false;

  const toDetailPath = (path: string) => {
    if (!id) return '/active-rentals';
    return path ? `/active-rentals/${id}/${path}` : `/active-rentals/${id}`;
  };

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
          boxShadow: showTopShadow ? '0 4px 14px rgba(18,74,87,0.16)' : 'none',
          transition: 'box-shadow 180ms ease',
        }}
      >
        <Box sx={{ maxWidth: '1584px', mx: 'auto', px: 3 }}>
          <StepsBar
            steps={stepsWithPath}
            currentStepNumber={currentStepNumber}
            periodLabel={periodLabel}
            onStepClick={(path) => navigate(toDetailPath(path))}
          />
        </Box>
      </Box>

      {/* 內容區（補上次導覽列的高度） */}
      <Box sx={{ pt: `${STEPS_BAR_HEIGHT}px` }}>
        <Outlet />
      </Box>

      {/* 共用 FAB（上下頁 + 捲頂 + 儲存） */}
      {prevRouteStep && (
        <Box sx={{ position: 'fixed', bottom: 68, left: 110, zIndex: 1200 }}>
          <Fab
            variant="extended"
            onClick={() => navigate(toDetailPath(prevRouteStep.path))}
            sx={{
              bgcolor: '#31a0e8',
              color: '#fff',
              fontWeight: 500,
              fontSize: '15px',
              letterSpacing: '0.46px',
              px: 2,
              gap: 1,
              boxShadow: '0px 1px 18px rgba(0,0,0,0.12), 0px 6px 10px rgba(0,0,0,0.14), 0px 3px 5px -1px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: '#2090d8' },
            }}
          >
            <MdArrowBackIosNew size={18} />
            {prevRouteStep.label}
          </Fab>
        </Box>
      )}

      <Box
        sx={{
          position: 'fixed',
          bottom: 68,
          right: 110,
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <Fab
          color="primary"
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            bgcolor: '#31a0e8',
            boxShadow: '0px 1px 18px rgba(0,0,0,0.12), 0px 6px 10px rgba(0,0,0,0.14), 0px 3px 5px -1px rgba(0,0,0,0.2)',
          }}
        >
          <MdArrowUpward size={24} />
        </Fab>

        {shouldShowSave && (
          <Fab
            variant="extended"
            sx={{
              bgcolor: '#ffffff',
              color: '#31a0e8',
              fontWeight: 500,
              fontSize: '15px',
              letterSpacing: '0.46px',
              textTransform: 'uppercase',
              px: 2,
              gap: 1,
              boxShadow: '0px 1px 18px rgba(0,0,0,0.12), 0px 6px 10px rgba(0,0,0,0.14), 0px 3px 5px -1px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: 'rgba(49,160,232,0.06)' },
            }}
          >
            儲存
            <MdSave size={22} />
          </Fab>
        )}

        {nextRouteStep && (
          <Fab
            variant="extended"
            onClick={() => navigate(toDetailPath(nextRouteStep.path))}
            sx={{
              bgcolor: '#31a0e8',
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '15px',
              letterSpacing: '0.46px',
              textTransform: 'uppercase',
              px: 2,
              gap: 1,
              boxShadow: '0px 1px 18px rgba(0,0,0,0.12), 0px 6px 10px rgba(0,0,0,0.14), 0px 3px 5px -1px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: '#2090d8' },
            }}
          >
            {nextRouteStep.label}
            <MdArrowForwardIos size={18} />
          </Fab>
        )}
      </Box>
    </>
  );
}
