import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  type StepIconProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MdCheck,
  MdAddCircle,
} from 'react-icons/md';
import { properties } from '../../data/mockData';
import PageContainer from '../../components/PageContainer';

// ─── 常數 ────────────────────────────────────────────────────────────────────

const INSPECTION_STEPS = [
  { label: '安全條件' },
  { label: '屋況' },
  { label: '基礎設備' },
  { label: '家電、家具' },
  { label: '管理相關事務' },
  { label: '附件' },
];

const BUILDING_TYPES = ['公寓', '華廈', '電梯大樓', '套房', '透天', '其他'];
const DEATH_HOLD_TYPES = ['自殺', '他殺', '意外', '其他'];
const FOLLOWUP_OPTIONS = ['修繕完畢', '修繕中', '未修繕', '其他'];
const CAR_PARK_STYLES = ['平面式', '機械式', '子母式', '坡道平面', '坡道機械', '其他'];

const APPLIANCE_ROWS: [string, string][] = [
  ['電視', '冷氣'],
  ['冰箱', '洗衣機'],
  ['微波爐', '烘碗機'],
  ['排油煙機', '瓦斯爐'],
];

const FURNITURE_ROWS: string[][] = [
  ['鞋櫃', '餐桌', '餐椅', '沙發'],
  ['電視櫃', '茶几', '床組(頭)', '衣櫃'],
  ['書物櫃', '吧台', '書桌', '書椅'],
];

const COLOR = {
  primary: 'var(--color-primary)',
  primaryLight: 'var(--color-primary-light)',
  secondary: 'var(--color-secondary)',
  secondaryLight: 'var(--color-secondary-light)',
  info: 'var(--color-info)',
  infoLight: 'var(--color-info-light)',
  error: 'var(--color-error)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textDisabled: 'var(--color-text-disabled)',
  white: 'var(--color-primary-contrast)',
  background: 'var(--color-background)',
  boxBg: 'var(--color-box-background-secondary)',
} as const;

// ─── 樣式常數 ──────────────────────────────────────────────────────────────────

const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '8px',
    bgcolor: COLOR.white,
    fontSize: '14px',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
    '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.4)' },
    '&.Mui-focused fieldset': { borderColor: COLOR.primary },
  },
};

const selectSx = {
  height: '40px',
  borderRadius: '8px',
  bgcolor: COLOR.white,
  fontSize: '14px',
  '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
  '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.4)' },
  '&.Mui-focused fieldset': { borderColor: COLOR.primary },
};

const checkboxSx = {
  color: COLOR.textDisabled,
  '&.Mui-checked': { color: COLOR.primary },
  padding: '4px',
};

// ─── Custom Stepper 樣式 ───────────────────────────────────────────────────────

const CustomConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    borderColor: COLOR.info,
    borderLeftWidth: 1,
    minHeight: 20,
  },
}));

function CustomStepIcon({ active, completed }: StepIconProps) {
  if (completed) {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: COLOR.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MdCheck size={20} color={COLOR.white} />
      </Box>
    );
  }
  if (active) {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `2px solid ${COLOR.secondary}`,
          bgcolor: COLOR.white,
        }}
      />
    );
  }
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: `2px solid ${COLOR.textDisabled}`,
        bgcolor: COLOR.white,
      }}
    />
  );
}

// ─── 共用子元件 ───────────────────────────────────────────────────────────────

/** 帶邊框卡片容器 */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: `1px solid ${COLOR.textDisabled}`,
        borderRadius: '10px',
        p: '12px',
        mb: 2,
      }}
    >
      <Typography sx={{ fontSize: '18px', color: COLOR.textPrimary, mb: 1.5, lineHeight: 'normal' }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/** 100px 方形新增圖片按鈕 */
function ImageUploadBtn() {
  return (
    <Box
      component="button"
      sx={{
        width: 100,
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        bgcolor: COLOR.white,
        border: '1px solid rgba(0,0,0,0.23)',
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': { borderColor: COLOR.primary },
      }}
    >
      <MdAddCircle size={24} color={COLOR.textSecondary} />
      <Typography sx={{ fontSize: '16px', color: COLOR.textSecondary, lineHeight: '24px' }}>
        新增圖片
      </Typography>
    </Box>
  );
}

/** 照片上傳區塊（標題 + 按鈕） */
function PhotoSection({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <Box
      sx={{
        borderTop: `1px solid ${COLOR.textDisabled}`,
        pt: '12px',
        mt: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '18px', color: COLOR.textPrimary, lineHeight: 'normal' }}>
          {label}
        </Typography>
        {required && (
          <Typography component="span" sx={{ fontSize: '18px', color: COLOR.error, ml: 0.5 }}>
            *
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <ImageUploadBtn />
      </Box>
    </Box>
  );
}

/** 欄位標籤 */
function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography sx={{ fontSize: '14px', color: COLOR.textSecondary, lineHeight: '22px' }}>
        {label}
      </Typography>
      {required && (
        <Typography component="span" sx={{ fontSize: '14px', color: COLOR.error, ml: 0.25, lineHeight: '22px' }}>
          *
        </Typography>
      )}
    </Box>
  );
}

/** ButtonGroup 選擇 */
function ToggleBtnGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        border: `1px solid ${COLOR.primary}`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {options.map((opt, i) => (
        <Box
          key={opt}
          component="button"
          onClick={() => onChange(opt)}
          sx={{
            height: 37,
            px: 2,
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            borderLeft: i > 0 ? `1px solid ${COLOR.primary}` : 'none',
            bgcolor: value === opt ? COLOR.primaryLight : 'transparent',
            color: value === opt ? COLOR.white : COLOR.primary,
            '&:hover': { bgcolor: value === opt ? COLOR.primaryLight : 'rgba(49,160,232,0.08)' },
          }}
        >
          {opt}
        </Box>
      ))}
    </Box>
  );
}

/** 導覽按鈕（返回 / 完成） */
function NavButtons({
  index,
  onBack,
  onNext,
  isLast = false,
  onFinish,
}: {
  index: number;
  onBack: () => void;
  onNext: () => void;
  isLast?: boolean;
  onFinish?: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
      {index > 0 && (
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderColor: COLOR.secondary,
            color: COLOR.secondary,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            height: '37px',
            px: 2.5,
            '&:hover': { borderColor: COLOR.secondary, bgcolor: COLOR.secondaryLight },
          }}
        >
          返回
        </Button>
      )}
      {isLast ? (
        <Button
          variant="contained"
          onClick={onFinish}
          sx={{
            bgcolor: COLOR.secondary,
            color: COLOR.white,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            height: '37px',
            px: 2.5,
            gap: 1,
            '&:hover': { bgcolor: '#6bc97c' },
            boxShadow: 'none',
          }}
        >
          完成後往承租人資料 →
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onNext}
          sx={{
            bgcolor: COLOR.secondary,
            color: COLOR.white,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            height: '37px',
            px: 2.5,
            gap: 0.75,
            '&:hover': { bgcolor: '#6bc97c' },
            boxShadow: 'none',
          }}
        >
          <MdCheck size={18} />
          完成
        </Button>
      )}
    </Box>
  );
}

// ─── Step 1: 安全條件 ─────────────────────────────────────────────────────────

function Step1Safety({ onNext }: { onNext: () => void }) {
  const [corridorClear, setCorridorClear] = useState(true);

  // 海砂屋
  const [isSaltHouse, setIsSaltHouse] = useState(false);
  const [saltTested, setSaltTested] = useState(false);
  const [saltResult, setSaltResult] = useState('合格');

  // 輻射屋
  const [isRadiationHouse, setIsRadiationHouse] = useState(false);
  const [radiationTested, setRadiationTested] = useState(false);
  const [radiationResult, setRadiationResult] = useState('合格');

  // 海砂/輻射後續處理
  const [saltFollowup, setSaltFollowup] = useState('');
  const [saltHandling, setSaltHandling] = useState('');
  const [radFollowup, setRadFollowup] = useState('');
  const [radHandling, setRadHandling] = useState('');

  // 消防設備
  const [hasExtinguisher, setHasExtinguisher] = useState(true);
  const [hasFireAlarm, setHasFireAlarm] = useState(false);
  const [hasSmokeDetector, setHasSmokeDetector] = useState(false);

  return (
    <Box>
      {/* 出入口無堆放雜物 */}
      <SectionCard title="出入口、走廊、通路、樓梯間無堆放雜物">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={corridorClear}
              onChange={e => setCorridorClear(e.target.checked)}
              sx={checkboxSx}
            />
          }
          label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>符合</Typography>}
          sx={{ m: 0 }}
        />
        {corridorClear && (
          <PhotoSection label="附件照片 - 出入口及樓梯間" required />
        )}
      </SectionCard>

      {/* 海砂屋檢測 */}
      <SectionCard title="海砂屋檢測">
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isSaltHouse}
                onChange={e => setIsSaltHouse(e.target.checked)}
                sx={checkboxSx}
              />
            }
            label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>是海砂屋</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={saltTested}
                onChange={e => setSaltTested(e.target.checked)}
                sx={checkboxSx}
              />
            }
            label={
              <Typography sx={{ fontSize: '14px', color: '#124a57' }}>
                <strong>做過</strong>混凝土中水溶性氯離子含量檢測
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Box>
        {saltTested && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Box>
              <FieldLabel label="檢測結果" />
              <ToggleBtnGroup
                options={['合格', '不合格']}
                value={saltResult}
                onChange={setSaltResult}
              />
            </Box>
            {saltResult === '不合格' && (
              <>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <FieldLabel label="後續處理" required />
                  <Select
                    value={saltFollowup}
                    onChange={e => setSaltFollowup(e.target.value)}
                    displayEmpty
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="" sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>其他</MenuItem>
                    {FOLLOWUP_OPTIONS.map(o => <MenuItem key={o} value={o} sx={{ fontSize: '14px' }}>{o}</MenuItem>)}
                  </Select>
                </Box>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <FieldLabel label="處理方式" required />
                  <TextField
                    value={saltHandling}
                    onChange={e => setSaltHandling(e.target.value)}
                    fullWidth
                    sx={inputSx}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </SectionCard>

      {/* 輻射屋檢測 */}
      <SectionCard title="輻射屋檢測">
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isRadiationHouse}
                onChange={e => setIsRadiationHouse(e.target.checked)}
                sx={checkboxSx}
              />
            }
            label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>是輻射屋</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={radiationTested}
                onChange={e => setRadiationTested(e.target.checked)}
                sx={checkboxSx}
              />
            }
            label={
              <Typography sx={{ fontSize: '14px', color: '#124a57' }}>
                <strong>做過</strong>輻射屋檢測
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Box>
        {radiationTested && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Box>
              <FieldLabel label="檢測結果" />
              <ToggleBtnGroup
                options={['合格', '不合格']}
                value={radiationResult}
                onChange={setRadiationResult}
              />
            </Box>
            {radiationResult === '不合格' && (
              <>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <FieldLabel label="後續處理" required />
                  <Select
                    value={radFollowup}
                    onChange={e => setRadFollowup(e.target.value)}
                    displayEmpty
                    fullWidth
                    sx={selectSx}
                  >
                    <MenuItem value="" sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>其他</MenuItem>
                    {FOLLOWUP_OPTIONS.map(o => <MenuItem key={o} value={o} sx={{ fontSize: '14px' }}>{o}</MenuItem>)}
                  </Select>
                </Box>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <FieldLabel label="處理方式" required />
                  <TextField
                    value={radHandling}
                    onChange={e => setRadHandling(e.target.value)}
                    fullWidth
                    sx={inputSx}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </SectionCard>

      {/* 具備消防方設備 */}
      <SectionCard title="具備消防方設備">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox size="small" checked={hasExtinguisher} onChange={e => setHasExtinguisher(e.target.checked)} sx={checkboxSx} />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>滅火器（必要，具在有效期限內）</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox size="small" checked={hasFireAlarm} onChange={e => setHasFireAlarm(e.target.checked)} sx={checkboxSx} />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>火警警報器</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox size="small" checked={hasSmokeDetector} onChange={e => setHasSmokeDetector(e.target.checked)} sx={checkboxSx} />
            }
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>獨立型偵煙器（兩警報器任一即可）</Typography>}
            sx={{ m: 0 }}
          />
        </Box>
        <PhotoSection label="附件照片" required />
      </SectionCard>

      <NavButtons index={0} onBack={() => {}} onNext={onNext} />
    </Box>
  );
}

// ─── Step 2: 屋況 ─────────────────────────────────────────────────────────────

function Step2Condition({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  // 漏水
  const [hasLeak, setHasLeak] = useState(false);
  const [leakLocation, setLeakLocation] = useState('');
  const [leakFollowup, setLeakFollowup] = useState('');
  const [leakHandling, setLeakHandling] = useState('');

  // 建物型態
  const [buildingType, setBuildingType] = useState('');
  const [otherBuildingType, setOtherBuildingType] = useState('');

  // 現況格局
  const [layoutType, setLayoutType] = useState('獨立套房');
  const [rooms, setRooms] = useState('');
  const [halls, setHalls] = useState('');
  const [baths, setBaths] = useState('');

  // 供水及排水
  const [waterAbnormal, setWaterAbnormal] = useState(false);
  const [waterResponsible, setWaterResponsible] = useState('出租人');

  // 非自然死亡
  const [deathOccurred, setDeathOccurred] = useState(false);
  const [deathBeforeOwnership, setDeathBeforeOwnership] = useState('');

  return (
    <Box>
      {/* 漏水狀況 */}
      <SectionCard title="漏水狀況">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={hasLeak} onChange={e => setHasLeak(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>有漏水情形</Typography>}
          sx={{ m: 0 }}
        />
        {hasLeak && (
          <>
            <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <FieldLabel label="漏水處" required />
                <TextField
                  value={leakLocation}
                  onChange={e => setLeakLocation(e.target.value)}
                  fullWidth
                  sx={inputSx}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <FieldLabel label="後續處理" required />
                <Select
                  value={leakFollowup}
                  onChange={e => setLeakFollowup(e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={selectSx}
                >
                  <MenuItem value="" sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>請選擇</MenuItem>
                  {FOLLOWUP_OPTIONS.map(o => <MenuItem key={o} value={o} sx={{ fontSize: '14px' }}>{o}</MenuItem>)}
                </Select>
              </Box>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <FieldLabel label="處理方式" required />
                <TextField
                  value={leakHandling}
                  onChange={e => setLeakHandling(e.target.value)}
                  fullWidth
                  sx={inputSx}
                />
              </Box>
            </Box>
            <PhotoSection label="附件照片 - 漏水處" required />
          </>
        )}
      </SectionCard>

      {/* 建物型態 */}
      <SectionCard title="建物型態">
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 160 }}>
            <FieldLabel label="建物型態" required />
            <Select
              value={buildingType}
              onChange={e => setBuildingType(e.target.value)}
              displayEmpty
              fullWidth
              sx={selectSx}
            >
              <MenuItem value="" sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>請選擇</MenuItem>
              {BUILDING_TYPES.map(t => <MenuItem key={t} value={t} sx={{ fontSize: '14px' }}>{t}</MenuItem>)}
            </Select>
          </Box>
          <Box sx={{ flex: 1, minWidth: 160 }}>
            <FieldLabel label="其他建物型態" required />
            <TextField
              value={otherBuildingType}
              onChange={e => setOtherBuildingType(e.target.value)}
              fullWidth
              sx={inputSx}
            />
          </Box>
        </Box>
      </SectionCard>

      {/* 現況格局 */}
      <SectionCard title="現況格局">
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Box>
            <FieldLabel label="格局類型" required />
            <ToggleBtnGroup
              options={['獨立套房', '整戶出租']}
              value={layoutType}
              onChange={setLayoutType}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <Box>
              <FieldLabel label="" />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextField
                  value={rooms}
                  onChange={e => setRooms(e.target.value)}
                  sx={{ ...inputSx, width: 72 }}
                  placeholder="0"
                />
                <Typography sx={{ fontSize: '14px', color: '#124a57' }}>房</Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextField
                  value={halls}
                  onChange={e => setHalls(e.target.value)}
                  sx={{ ...inputSx, width: 72 }}
                  placeholder="0"
                />
                <Typography sx={{ fontSize: '14px', color: '#124a57' }}>廳</Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextField
                  value={baths}
                  onChange={e => setBaths(e.target.value)}
                  sx={{ ...inputSx, width: 72 }}
                  placeholder="0"
                />
                <Typography sx={{ fontSize: '14px', color: '#124a57' }}>衛</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </SectionCard>

      {/* 供水及排水 */}
      <SectionCard title="供水及排水">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={waterAbnormal} onChange={e => setWaterAbnormal(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>不正常</Typography>}
          sx={{ m: 0 }}
        />
        {waterAbnormal && (
          <Box sx={{ mt: 1.5 }}>
            <FieldLabel label="負責維修方" />
            <ToggleBtnGroup
              options={['出租人', '承租人']}
              value={waterResponsible}
              onChange={setWaterResponsible}
            />
          </Box>
        )}
      </SectionCard>

      {/* 是否發生非自然死亡情事 */}
      <SectionCard title="是否發生非自然死亡情事">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={deathOccurred} onChange={e => setDeathOccurred(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>曾經持有期間有發生</Typography>}
          sx={{ m: 0, mb: 1.5 }}
        />
        <Box sx={{ maxWidth: 340 }}>
          <FieldLabel label="產權持有前" required />
          <Select
            value={deathBeforeOwnership}
            onChange={e => setDeathBeforeOwnership(e.target.value)}
            displayEmpty
            fullWidth
            sx={selectSx}
          >
            <MenuItem value="" sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>請選擇</MenuItem>
            {DEATH_HOLD_TYPES.map(t => <MenuItem key={t} value={t} sx={{ fontSize: '14px' }}>{t}</MenuItem>)}
          </Select>
        </Box>
      </SectionCard>

      <NavButtons index={1} onBack={onBack} onNext={onNext} />
    </Box>
  );
}

// ─── Step 3: 基礎設備 ─────────────────────────────────────────────────────────

function Step3Equipment({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  // 衛浴
  const [hasBathroom, setHasBathroom] = useState(true);

  // 熱水器
  const [hasHeater, setHasHeater] = useState(false);
  const [heaterType, setHeaterType] = useState('電熱水器');
  const [heaterLocation, setHeaterLocation] = useState('室外');
  const [heaterBrand, setHeaterBrand] = useState('');
  const [hasExhaust, setHasExhaust] = useState(false);

  // 附屬設備
  const [hasGas, setHasGas] = useState(false);
  const [hasCable, setHasCable] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);

  const showExhaustCheck = hasHeater && heaterType === '瓦斯熱水器' && heaterLocation === '室內';

  return (
    <Box>
      {/* 衛浴設備 */}
      <SectionCard title="具備馬桶、洗臉盆及浴缸 (或淋浴) 等 3 項衛浴設備">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={hasBathroom} onChange={e => setHasBathroom(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>具備</Typography>}
          sx={{ m: 0 }}
        />
        {hasBathroom && (
          <PhotoSection label="附件照片 - 衛浴設備" required />
        )}
      </SectionCard>

      {/* 熱水器 */}
      <SectionCard title="具備熱水器">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={hasHeater} onChange={e => setHasHeater(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>具備</Typography>}
          sx={{ m: 0 }}
        />
        {hasHeater && (
          <>
            <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <Box>
                <FieldLabel label="類型" />
                <ToggleBtnGroup
                  options={['電熱水器', '瓦斯熱水器']}
                  value={heaterType}
                  onChange={setHeaterType}
                />
              </Box>
              <Box>
                <FieldLabel label="設置位置" />
                <ToggleBtnGroup
                  options={['室外', '室內']}
                  value={heaterLocation}
                  onChange={setHeaterLocation}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <FieldLabel label="廠牌/型號" />
                <TextField
                  value={heaterBrand}
                  onChange={e => setHeaterBrand(e.target.value)}
                  fullWidth
                  sx={inputSx}
                />
              </Box>
            </Box>
            {showExhaustCheck && (
              <Box sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox size="small" checked={hasExhaust} onChange={e => setHasExhaust(e.target.checked)} sx={checkboxSx} />
                  }
                  label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>有加裝排氣管且符合標準</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>
            )}
            <PhotoSection label="附件照片 - 熱水器及設置空間" required />
          </>
        )}
      </SectionCard>

      {/* 附屬設備項目 */}
      <SectionCard title="附屬設備項目">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={hasGas} onChange={e => setHasGas(e.target.checked)} sx={checkboxSx} />}
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>天然瓦斯</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={hasCable} onChange={e => setHasCable(e.target.checked)} sx={checkboxSx} />}
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>第四台</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={hasWifi} onChange={e => setHasWifi(e.target.checked)} sx={checkboxSx} />}
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>無線網路</Typography>}
            sx={{ m: 0 }}
          />
        </Box>
      </SectionCard>

      <NavButtons index={2} onBack={onBack} onNext={onNext} />
    </Box>
  );
}

// ─── Step 4: 家電、家具 ───────────────────────────────────────────────────────

const ALL_APPLIANCES = APPLIANCE_ROWS.flat();
const ALL_FURNITURE = FURNITURE_ROWS.flat();

function Step4Furniture({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [applianceData, setApplianceData] = useState<Record<string, { count: string; brand: string }>>(
    Object.fromEntries(ALL_APPLIANCES.map(item => [item, { count: '', brand: '' }]))
  );
  const [otherAppliance, setOtherAppliance] = useState('');

  const [furnitureData, setFurnitureData] = useState<Record<string, string>>(
    Object.fromEntries(ALL_FURNITURE.map(item => [item, '']))
  );
  const [otherFurniture, setOtherFurniture] = useState('');

  const setAppliance = (item: string, field: 'count' | 'brand', val: string) =>
    setApplianceData(prev => ({ ...prev, [item]: { ...prev[item], [field]: val } }));

  const hasApplianceCount = ALL_APPLIANCES.some(item => applianceData[item].count.trim() !== '');
  const hasFurnitureCount = ALL_FURNITURE.some(item => furnitureData[item].trim() !== '');

  return (
    <Box>
      {/* 附屬家電 */}
      <SectionCard title="附屬家電（數量、廠商/型號）">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {APPLIANCE_ROWS.map((row, ri) => (
            <Box key={ri} sx={{ display: 'flex', gap: 2 }}>
              {row.map(item => (
                <Box key={item} sx={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel label={item} />
                    <TextField
                      placeholder="數量"
                      value={applianceData[item].count}
                      onChange={e => setAppliance(item, 'count', e.target.value)}
                      fullWidth
                      sx={{ ...inputSx}}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel label="廠牌/型號" />
                    <TextField
                      value={applianceData[item].brand}
                      onChange={e => setAppliance(item, 'brand', e.target.value)}
                      fullWidth
                      sx={inputSx}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
          <Box>
            <FieldLabel label="其他" />
            <TextField
              value={otherAppliance}
              onChange={e => setOtherAppliance(e.target.value)}
              fullWidth
              sx={inputSx}
            />
          </Box>
        </Box>
        {hasApplianceCount && <PhotoSection label="附件照片 - 家電照片" required />}
      </SectionCard>

      {/* 附屬家具 */}
      <SectionCard title="附屬家具（數量）">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {FURNITURE_ROWS.map((row, ri) => (
            <Box key={ri} sx={{ display: 'flex', gap: 2 }}>
              {row.map(item => (
                <Box key={item} sx={{ flex: 1, minWidth: 80 }}>
                  <FieldLabel label={item} />
                  <TextField
                    placeholder="數量"
                    value={furnitureData[item]}
                    onChange={e => setFurnitureData(prev => ({ ...prev, [item]: e.target.value }))}
                    fullWidth
                    sx={inputSx}
                  />
                </Box>
              ))}
            </Box>
          ))}
          <Box>
            <FieldLabel label="其他" />
            <TextField
              value={otherFurniture}
              onChange={e => setOtherFurniture(e.target.value)}
              fullWidth
              sx={inputSx}
            />
          </Box>
        </Box>
        {hasFurnitureCount && <PhotoSection label="附件照片 - 家具照片" required />}
      </SectionCard>

      <NavButtons index={3} onBack={onBack} onNext={onNext} />
    </Box>
  );
}

// ─── Step 5: 管理相關事務 ─────────────────────────────────────────────────────

function Step5Management({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  // 管理委員
  const [hasCommittee, setHasCommittee] = useState(false);
  const [hasMgmtFee, setHasMgmtFee] = useState(false);
  const [mgmtFeePerPing, setMgmtFeePerPing] = useState('');
  const [mgmtFeePerMonth, setMgmtFeePerMonth] = useState('');

  // 汽車停車
  const [hasCarParking, setHasCarParking] = useState(false);
  const [hasCarTitle, setHasCarTitle] = useState(false);
  const [hasCarAgreement, setHasCarAgreement] = useState(false);
  const [carParkStyle, setCarParkStyle] = useState('');
  const [carParkLocation, setCarParkLocation] = useState('地上');
  const [carParkFloor, setCarParkFloor] = useState('');
  const [carParkNumber, setCarParkNumber] = useState('');
  const [carParkFee, setCarParkFee] = useState('');

  // 機車停車
  const [hasMotoParking, setHasMotoParking] = useState(false);
  const [motoParkLocation, setMotoParkLocation] = useState('地上');
  const [motoParkFloor, setMotoParkFloor] = useState('');
  const [motoParkFee, setMotoParkFee] = useState('');
  const [motoParkNumber, setMotoParkNumber] = useState('');

  // 其他事務
  const [hasBylaw, setHasBylaw] = useState(false);
  const [hasFireInspection, setHasFireInspection] = useState(false);
  const [hasParkDebt, setHasParkDebt] = useState(false);
  const [parkDebtAmount, setParkDebtAmount] = useState('');

  return (
    <Box>
      {/* 管理委員統一管理 */}
      <SectionCard title="管理委員統一管理">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox size="small" checked={hasCommittee} onChange={e => setHasCommittee(e.target.checked)} sx={checkboxSx} />
            }
            label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>有管理委員會</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox size="small" checked={hasMgmtFee} onChange={e => setHasMgmtFee(e.target.checked)} sx={checkboxSx} />
            }
            label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>有管理費</Typography>}
            sx={{ m: 0 }}
          />
        </Box>
        {hasMgmtFee && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 160 }}>
              <FieldLabel label="管理費（每坪）" required />
              <TextField value={mgmtFeePerPing} onChange={e => setMgmtFeePerPing(e.target.value)} fullWidth sx={inputSx} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 160 }}>
              <FieldLabel label="管理費（每月）" required />
              <TextField value={mgmtFeePerMonth} onChange={e => setMgmtFeePerMonth(e.target.value)} fullWidth sx={inputSx} />
            </Box>
          </Box>
        )}
      </SectionCard>

      {/* 汽車停車 */}
      <SectionCard title="汽車停車">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={hasCarParking} onChange={e => setHasCarParking(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>有汽車停車位</Typography>}
          sx={{ m: 0 }}
        />
        {hasCarParking && (
          <>
            <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={hasCarTitle} onChange={e => setHasCarTitle(e.target.checked)} sx={checkboxSx} />}
                label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>有獨立權狀</Typography>}
                sx={{ m: 0 }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={hasCarAgreement} onChange={e => setHasCarAgreement(e.target.checked)} sx={checkboxSx} />}
                label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>有檢附分管協議及圖說</Typography>}
                sx={{ m: 0 }}
              />
            </Box>
            <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 140 }}>
                <FieldLabel label="車位樣式" required />
                <Select value={carParkStyle} onChange={e => setCarParkStyle(e.target.value)} displayEmpty fullWidth sx={selectSx}>
                  <MenuItem value="" sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>請選擇</MenuItem>
                  {CAR_PARK_STYLES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '14px' }}>{s}</MenuItem>)}
                </Select>
              </Box>
              <Box>
                <FieldLabel label="位置" />
                <ToggleBtnGroup options={['地上', '地下']} value={carParkLocation} onChange={setCarParkLocation} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <FieldLabel label="車位樓層" required />
                <TextField value={carParkFloor} onChange={e => setCarParkFloor(e.target.value)} fullWidth sx={inputSx} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <FieldLabel label="車位編號" required />
                <TextField value={carParkNumber} onChange={e => setCarParkNumber(e.target.value)} fullWidth sx={inputSx} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 140 }}>
                <FieldLabel label="停車管理費（每月）" required />
                <TextField value={carParkFee} onChange={e => setCarParkFee(e.target.value)} fullWidth sx={inputSx} />
              </Box>
            </Box>
          </>
        )}
      </SectionCard>

      {/* 機車停車 */}
      <SectionCard title="機車停車">
        <FormControlLabel
          control={
            <Checkbox size="small" checked={hasMotoParking} onChange={e => setHasMotoParking(e.target.checked)} sx={checkboxSx} />
          }
          label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>有機車停車位</Typography>}
          sx={{ m: 0 }}
        />
        {hasMotoParking && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Box>
              <FieldLabel label="位置" />
              <ToggleBtnGroup options={['地上', '地下']} value={motoParkLocation} onChange={setMotoParkLocation} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <FieldLabel label="車位樓層" required />
              <TextField value={motoParkFloor} onChange={e => setMotoParkFloor(e.target.value)} fullWidth sx={inputSx} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 140 }}>
              <FieldLabel label="停車管理費（每月）" required />
              <TextField value={motoParkFee} onChange={e => setMotoParkFee(e.target.value)} fullWidth sx={inputSx} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <FieldLabel label="車位編號" />
              <TextField value={motoParkNumber} onChange={e => setMotoParkNumber(e.target.value)} fullWidth sx={inputSx} />
            </Box>
          </Box>
        )}
      </SectionCard>

      {/* 其他事務 */}
      <SectionCard title="其他事務">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={hasBylaw} onChange={e => setHasBylaw(e.target.checked)} sx={checkboxSx} />}
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>有公寓大廈規約</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={hasFireInspection} onChange={e => setHasFireInspection(e.target.checked)} sx={checkboxSx} />}
            label={<Typography sx={{ fontSize: '14px', color: '#124a57' }}>有定期辦理消防安全檢查</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={hasParkDebt} onChange={e => setHasParkDebt(e.target.checked)} sx={checkboxSx} />}
            label={<Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#124a57' }}>有積欠停車位管理費</Typography>}
            sx={{ m: 0 }}
          />
        </Box>
        {hasParkDebt && (
          <Box sx={{ mt: 1.5, maxWidth: 480 }}>
            <FieldLabel label="積欠費用" required />
            <TextField value={parkDebtAmount} onChange={e => setParkDebtAmount(e.target.value)} fullWidth sx={inputSx} />
          </Box>
        )}
      </SectionCard>

      <NavButtons index={4} onBack={onBack} onNext={onNext} />
    </Box>
  );
}

// ─── Step 6: 附件 ─────────────────────────────────────────────────────────────

function Step6Attachments({ onBack, onFinish }: { onBack: () => void; onFinish: () => void }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* 門牌及大門 */}
        <Box
          sx={{
            flex: 1,
            border: '1px solid rgba(36,53,82,0.35)',
            borderRadius: '10px',
            p: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: '18px', color: '#124a57', lineHeight: 'normal' }}>門牌及大門</Typography>
            <Typography component="span" sx={{ fontSize: '18px', color: '#fc4b6c', ml: 0.5 }}>*</Typography>
          </Box>
          <ImageUploadBtn />
        </Box>

        {/* 其他（非必要） */}
        <Box
          sx={{
            flex: 1,
            border: '1px solid rgba(36,53,82,0.35)',
            borderRadius: '10px',
            p: '12px',
          }}
        >
          <Typography sx={{ fontSize: '18px', color: '#124a57', lineHeight: 'normal', mb: 1.5 }}>其他（非必要）</Typography>
          <ImageUploadBtn />
        </Box>
      </Box>

      <NavButtons index={5} onBack={onBack} onNext={() => {}} isLast onFinish={onFinish} />
    </Box>
  );
}

// ─── 主頁面 ───────────────────────────────────────────────────────────────────

export default function ActiveRentalInspectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = id === 'new';
  const property = isNew ? null : properties.find(p => p.id === id);
  const statusTags = isNew ? [{ date: '', label: 'New' }] : (property?.statusTags ?? []);

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const stepperRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (stepperRef.current) {
      const steps = stepperRef.current.querySelectorAll('.MuiStep-root');
      steps[activeStep]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeStep]);

  const handleNext = () => {
    setCompletedSteps(prev => new Set(prev).add(activeStep));
    setActiveStep(s => s + 1);
  };

  const handleBack = () => setActiveStep(s => s - 1);

  const handleGoToStep = (index: number) => {
    if (index !== activeStep) setActiveStep(index);
  };

  const handleFinish = () => {
    setCompletedSteps(prev => new Set(prev).add(activeStep));
    setFinished(true);
    setTimeout(() => {
      navigate(`/active-rentals/${id}/tenant`);
    }, 2000);
  };

  const stepContents = [
    <Step1Safety onNext={handleNext} />,
    <Step2Condition onBack={handleBack} onNext={handleNext} />,
    <Step3Equipment onBack={handleBack} onNext={handleNext} />,
    <Step4Furniture onBack={handleBack} onNext={handleNext} />,
    <Step5Management onBack={handleBack} onNext={handleNext} />,
    <Step6Attachments onBack={handleBack} onFinish={handleFinish} />,
  ];

  return (
    <PageContainer>

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* 屋況檢索 Card */}
        <Box
          sx={{
            bgcolor: COLOR.boxBg,
            borderRadius: '16px',
            boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
            p: 4,
          }}
        >
          {/* Vertical Stepper */}
          <Stepper
            ref={stepperRef}
            nonLinear
            activeStep={finished ? INSPECTION_STEPS.length : activeStep}
            orientation="vertical"
            connector={<CustomConnector />}
          >
            {INSPECTION_STEPS.map((step, index) => (
              <Step key={step.label} completed={finished || completedSteps.has(index)}>
                <StepLabel
                  slots={{ stepIcon: CustomStepIcon }}
                  onClick={() => handleGoToStep(index)}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiStepLabel-label': {
                      fontSize: '24px',
                      lineHeight: '1.167',
                      fontWeight: 500,
                      color: finished || completedSteps.has(index) || index === activeStep
                        ? COLOR.textPrimary
                        : COLOR.textSecondary,
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
                <StepContent
                  sx={{
                    borderLeft: `1px solid ${COLOR.info}`,
                  }}
                >
                  <Box sx={{ pl: 1, pt: 1 }}>
                    {stepContents[index]}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* 完成狀態 */}
          {finished && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                py: 6,
              }}
            >
              <MdCheck size={56} color={COLOR.secondary} />
              <Typography sx={{ fontSize: '18px', fontWeight: 500, color: COLOR.secondary }}>
                即將前往承租人資料...
              </Typography>
            </Box>
          )}
        </Box>

        </Box>{/* end sections */}
    </PageContainer>
  );
}
