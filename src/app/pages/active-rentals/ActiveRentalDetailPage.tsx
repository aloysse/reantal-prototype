import { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Fab,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormControlLabel,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import {
  MdArrowUpward,
  MdSave,
  MdArrowForwardIos,
  MdExpandMore,
  MdExpandLess,
  MdFileUpload,
  MdAutoFixHigh,
  MdLocationOn,
  MdFolderOpen,
} from 'react-icons/md';
import { properties } from '../../data/mockData';
import type { PropertyFormData, PropertyType } from '../../data/mockData';

// ─── 常數 ────────────────────────────────────────────────────────────────────

const APPLIANCE_OPTIONS = ['洗衣機', '冰箱', '冷氣', '熱水器', '微波爐', '烘碗機', '烘衣機'];
const FURNITURE_OPTIONS = ['床', '衣櫃', '沙發', '餐桌', '書桌', '電視'];
const TENANT_OPTIONS = ['學生', '上班族', '家庭', '外國人', '老年人'];
const RENT_INCLUDES_OPTIONS = ['管理費', '水費', '電費', '網路', '瓦斯', '第四台'];
const LIFE_OPTIONS = ['近捷運', '近公車', '近超市', '近便利商店', '近夜市', '近學校', '近醫院', '近公園'];
const DECORATION_LEVELS = ['尚未整理', '一般清潔', '活化裝潢', '中上裝潢', '豪華裝潢'];
const DECORATION_TYPES = ['現代風', '日式風', '北歐風', '美式風', '工業風'];
const LIVING_ROOM_STATUS = ['無客廳', '共用客廳', '中上裝修', '豪華裝修'];
const VIEW_TYPES = ['無視野', '一般市景', '中上景觀', '頂級景觀'];
const UNIT_TYPES = ['套房', '分租套房', '雅房', '整層住家'];
const DEPOSIT_OPTIONS = ['1個月', '2個月', '3個月'];
const MIN_LEASE_OPTIONS = ['3個月', '6個月', '1年', '2年'];
const BRANCH_OPTIONS = ['新北板橋分店', '台北信義分店', '台北大安分店'];
const DEPARTMENT_OPTIONS = ['業務部', '管理部', '客服部'];


// ─── 共用子元件 ───────────────────────────────────────────────────────────────

const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '8px',
    bgcolor: '#ffffff',
    fontSize: '14px',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
    '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.4)' },
  },
} as const;

const selectSx = {
  height: '40px',
  borderRadius: '8px',
  bgcolor: '#ffffff',
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
} as const;

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)', lineHeight: '22px', mb: 1 }}>
      {label}
      {required && <span style={{ color: '#fc4b6c', marginLeft: 2 }}>*</span>}
    </Typography>
  );
}

function FieldWrap({ children, label, required, half }: {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  half?: boolean;
}) {
  return (
    <Box sx={{ flex: half ? '0 0 calc(50% - 8px)' : '1 1 auto', minWidth: 0 }}>
      {label && <FieldLabel label={label} required={required} />}
      {children}
    </Box>
  );
}

function StyledInput({ value, onChange, placeholder, fullWidth }: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}) {
  return (
    <TextField
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth={fullWidth !== false}
      sx={inputSx}
    />
  );
}

function StyledSelect({ value, onChange, options, placeholder }: {
  value?: string;
  onChange?: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <Select
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      displayEmpty
      size="small"
      fullWidth
      sx={selectSx}
    >
      {placeholder && <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>{placeholder}</MenuItem>}
      {options.map(o => <MenuItem key={o} value={o} sx={{ fontSize: '14px' }}>{o}</MenuItem>)}
    </Select>
  );
}

function BinaryToggle({ value, trueLabel, falseLabel, onChange }: {
  value?: boolean;
  trueLabel: string;
  falseLabel: string;
  onChange?: (v: boolean) => void;
}) {
  return (
    <Box sx={{ display: 'flex', border: '1px solid #31a0e8', borderRadius: '8px', overflow: 'hidden', height: '37px' }}>
      {[{ v: false, label: falseLabel }, { v: true, label: trueLabel }].map((opt, i) => (
        <Box
          key={String(opt.v)}
          onClick={() => onChange?.(opt.v)}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: value === opt.v ? '#66baf2' : '#ffffff',
            borderLeft: i > 0 ? '1px solid #31a0e8' : 'none',
            cursor: 'pointer',
            '&:hover': { bgcolor: value === opt.v ? '#66baf2' : 'rgba(49,160,232,0.06)' },
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: value === opt.v ? '#ffffff' : '#31a0e8', userSelect: 'none' }}>
            {opt.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function MultiChips({ options, selected, onChange, label, required }: {
  options: string[];
  selected?: string[];
  onChange?: (v: string[]) => void;
  label: string;
  required?: boolean;
}) {
  const current = selected ?? [];
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <FieldLabel label={label} required={required} />
      <Select
        multiple
        value={current}
        onChange={e => onChange?.(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
        input={<OutlinedInput />}
        displayEmpty
        renderValue={(vals) =>
          (vals as string[]).length === 0
            ? <Typography sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>請選擇</Typography>
            : <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(vals as string[]).map(v => (
                  <Chip key={v} label={v} size="small" sx={{ height: '22px', fontSize: '12px', bgcolor: 'rgba(49,160,232,0.12)', color: '#31a0e8' }} />
                ))}
              </Box>
        }
        fullWidth
        size="small"
        sx={{
          ...selectSx,
          height: 'auto',
          minHeight: '40px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
          '& .MuiSelect-select': { py: current.length > 0 ? '6px' : '8px' },
        }}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt} sx={{ fontSize: '14px' }}>
            <Checkbox checked={current.includes(opt)} size="small" sx={{ py: 0, color: '#31a0e8', '&.Mui-checked': { color: '#31a0e8' } }} />
            <ListItemText primary={opt} slotProps={{ primary: { style: { fontSize: '14px' } } }} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

// ─── ImageUpload ─────────────────────────────────────────────────────────────

function ImageUpload({ value, onChange }: { value?: string; onChange?: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange?.(url);
  };
  return (
    <Box
      onClick={() => inputRef.current?.click()}
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(0,0,0,0.23)',
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        cursor: 'pointer',
        minHeight: '140px',
        '&:hover': { borderColor: '#31a0e8' },
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      {value ? (
        <Box component="img" src={value} sx={{ width: '100%', flex: 1, objectFit: 'cover' }} />
      ) : (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <MdFileUpload size={24} color="rgba(36,53,82,0.6)" />
          <Typography sx={{ fontSize: '16px', color: 'rgba(36,53,82,0.6)' }}>上傳圖片</Typography>
        </Box>
      )}
      <Box sx={{ width: '100%', height: '28px', bgcolor: '#e8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <MdAutoFixHigh size={16} color="#0173bd" />
        <Typography sx={{ fontSize: '12px', color: '#0173bd' }}>提供智慧解析，自動帶入資料</Typography>
      </Box>
    </Box>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <Box sx={{ bgcolor: '#fafafa', borderRadius: '16px', boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)', overflow: 'hidden' }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: expanded ? 3 : 4 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '8px solid #31a0e8', pl: 2 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57', lineHeight: 1.167 }}>{title}</Typography>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(v => !v)} sx={{ color: 'rgba(36,53,82,0.5)' }}>
          {expanded ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </IconButton>
      </Box>
      {expanded && <Box sx={{ px: 4, pb: 4 }}>{children}</Box>}
    </Box>
  );
}

// ─── StepsBar ────────────────────────────────────────────────────────────────

// ─── 主頁面 ───────────────────────────────────────────────────────────────────

export default function ActiveRentalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = id === 'new';

  // 取得物件資料（新增為空）
  const property = isNew ? null : properties.find(p => p.id === id);
  const propertyType: PropertyType = isNew
    ? (searchParams.get('type') as PropertyType ?? 'social')
    : (property?.type ?? 'social');

  // statusTags：既有物件從 mock data 取，新增則顯示 "New"
  const statusTags = isNew
    ? [{ date: '', label: 'New' }]
    : (property?.statusTags ?? []);

  const initialData = property?.formData ?? {};
  const [form, setForm] = useState<PropertyFormData>(initialData);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const set = <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ bgcolor: '#eef1f2', pb: 12 }}>
      <Box sx={{ maxWidth: '1584px', mx: 'auto', px: 3, pt: 2 }}>

        {/* Status Tags */}
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

        {/* Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* ── 謄本資訊 ── */}
          <SectionCard title="謄本資訊">
            {propertyType === 'social' ? (
              // 社會住宅：左側圖片上傳 + 右側欄位
              <Box sx={{ display: 'flex', gap: 4.5, alignItems: 'stretch' }}>
                {/* 第一類謄本 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0, width: '240px' }}>
                  <FieldLabel label="第一類謄本" />
                  <ImageUpload value={photoUrl} onChange={setPhotoUrl} />
                </Box>
                {/* 右側欄位 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <AddressRow form={form} set={set} />
                  <LotHouseRow form={form} set={set} />
                  <CoordAreaRow form={form} set={set} />
                  <ShareRow form={form} set={set} />
                </Box>
              </Box>
            ) : (
              // 一般租賃：匯入謄本按鈕 + 下方欄位
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <FieldLabel label="謄本" />
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      px: 3,
                      py: 1,
                      bgcolor: '#31a0e8',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      height: '40px',
                      '&:hover': { bgcolor: '#2090d8' },
                    }}
                  >
                    <MdFileUpload size={18} color="#ffffff" />
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>匯入謄本</Typography>
                  </Box>
                </Box>
                <AddressRow form={form} set={set} />
                <LotHouseRow form={form} set={set} />
                <CoordAreaRow form={form} set={set} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FieldWrap label="重要使用限值" half>
                    <StyledInput value={form.actualArea} onChange={v => set('actualArea', v)} />
                  </FieldWrap>
                  <FieldWrap half>
                    <FieldLabel label="建物持分比" required />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StyledInput value={form.shareNumerator} onChange={v => set('shareNumerator', v)} placeholder="分子" />
                      <Typography sx={{ fontSize: '14px', color: '#124a57', px: 0.5 }}>/</Typography>
                      <StyledInput value={form.shareDenominator} onChange={v => set('shareDenominator', v)} placeholder="分母" />
                    </Box>
                  </FieldWrap>
                </Box>
              </Box>
            )}
          </SectionCard>

          {/* ── 基本資料 ── */}
          <SectionCard title="基本資料">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* 案名 */}
              <Box>
                <FieldLabel label="案名" required />
                <StyledInput value={form.caseName} onChange={v => set('caseName', v)} fullWidth />
              </Box>
              {/* 總樓層 + 社區名稱 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldWrap label="總樓層" required half>
                  <StyledInput value={form.totalFloors} onChange={v => set('totalFloors', v)} />
                </FieldWrap>
                <FieldWrap label="社區名稱" half>
                  <StyledInput value={form.communityName} onChange={v => set('communityName', v)} />
                </FieldWrap>
              </Box>
              {/* 格局 + 房屋狀況 */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel label="格局" required />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.isOpenLayout ?? false}
                          onChange={e => set('isOpenLayout', e.target.checked)}
                          size="small"
                          sx={{ color: '#31a0e8', '&.Mui-checked': { color: '#31a0e8' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '14px' }}>開放式格局</Typography>}
                      sx={{ mr: 0 }}
                    />
                    {[
                      { key: 'rooms' as const, label: '房' },
                      { key: 'halls' as const, label: '廳' },
                      { key: 'bathrooms' as const, label: '衛' },
                      { key: 'kitchens' as const, label: '廚' },
                    ].map(({ key, label }) => (
                      <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Select
                          value={String(form[key] ?? 1)}
                          onChange={e => set(key, Number(e.target.value))}
                          size="small"
                          sx={{ ...selectSx, width: '72px' }}
                        >
                          {[0, 1, 2, 3, 4, 5].map(n => (
                            <MenuItem key={n} value={String(n)} sx={{ fontSize: '14px' }}>{n}</MenuItem>
                          ))}
                        </Select>
                        <Typography sx={{ fontSize: '14px', color: '#124a57' }}>{label}</Typography>
                      </Box>
                    ))}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.hasBalcony ?? false}
                          onChange={e => set('hasBalcony', e.target.checked)}
                          size="small"
                          sx={{ color: '#31a0e8', '&.Mui-checked': { color: '#31a0e8' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '14px' }}>陽台</Typography>}
                      sx={{ mr: 0 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel label="房屋狀況" />
                  <StyledInput value={form.houseCondition} onChange={v => set('houseCondition', v)} />
                </Box>
              </Box>
              {/* 可使用坪數 + 建築竣工日期 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldWrap label="可使用坪數" required half>
                  <StyledInput value={form.usableArea} onChange={v => set('usableArea', v)} />
                </FieldWrap>
                <FieldWrap label="建築竣工日期" half>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    value={form.completionDate ?? ''}
                    onChange={e => set('completionDate', e.target.value)}
                    sx={inputSx}
                  />
                </FieldWrap>
              </Box>
              {/* 設備 / 傢俱 / 身份（同排，三欄） */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <MultiChips label="設備提供" options={APPLIANCE_OPTIONS} selected={form.appliances} onChange={v => set('appliances', v)} />
                <MultiChips label="傢俱提供" options={FURNITURE_OPTIONS} selected={form.furniture} onChange={v => set('furniture', v)} />
                <MultiChips label="身份選擇" options={TENANT_OPTIONS} selected={form.targetTenants} onChange={v => set('targetTenants', v)} />
              </Box>
              {/* 電梯/開火/養寵物/車位 + 單位型態 */}
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                {[
                  { key: 'hasElevator' as const, label: '電梯', t: '有', f: '無' },
                  { key: 'allowCooking' as const, label: '開火', t: '可', f: '不可' },
                  { key: 'allowPets' as const, label: '養寵物', t: '可', f: '不可' },
                  { key: 'hasParking' as const, label: '車位', t: '有', f: '無' },
                ].map(({ key, label, t, f }) => (
                  <Box key={key}>
                    <FieldLabel label={label} />
                    <BinaryToggle value={form[key]} trueLabel={t} falseLabel={f} onChange={v => set(key, v)} />
                  </Box>
                ))}
                <Box sx={{ flex: 1 }}>
                  <FieldLabel label="單位型態" />
                  <StyledSelect value={form.unitType} onChange={v => set('unitType', v)} options={UNIT_TYPES} placeholder="請選擇" />
                </Box>
              </Box>
            </Box>
          </SectionCard>

          {/* ── 加分項目 ── */}
          <SectionCard title="加分項目">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* 裝潢程度 + 裝潢類型 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldWrap label="裝潢程度" required half>
                  <StyledSelect value={form.decorationLevel} onChange={v => set('decorationLevel', v)} options={DECORATION_LEVELS} placeholder="請選擇" />
                </FieldWrap>
                <FieldWrap label="裝潢類型" half>
                  <StyledSelect value={form.decorationType} onChange={v => set('decorationType', v)} options={DECORATION_TYPES} placeholder="請選擇" />
                </FieldWrap>
              </Box>
              {/* Row 2 差異：社宅=客廳狀態+生活機能，一般=生活機能+視野居住 */}
              {propertyType === 'social' ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <FieldWrap label="客廳狀態" required half>
                    <StyledSelect value={form.livingRoomStatus} onChange={v => set('livingRoomStatus', v)} options={LIVING_ROOM_STATUS} placeholder="請選擇" />
                  </FieldWrap>
                  <MultiChips label="生活機能" options={LIFE_OPTIONS} selected={form.lifeConvenience} onChange={v => set('lifeConvenience', v)} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <MultiChips label="生活機能" options={LIFE_OPTIONS} selected={form.lifeConvenience} onChange={v => set('lifeConvenience', v)} />
                  <FieldWrap label="視野居住" half>
                    <StyledSelect value={form.viewType} onChange={v => set('viewType', v)} options={VIEW_TYPES} placeholder="請選擇" />
                  </FieldWrap>
                </Box>
              )}
            </Box>
          </SectionCard>

          {/* ── 費用 ── */}
          <SectionCard title="費用">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* 預期租金 + 押金 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <FieldLabel label="預期租金" required />
                    <Typography sx={{ fontSize: '12px', color: 'rgba(36,53,82,0.5)' }}>
                      粗金水準範圍 上限: ¥{Number(form.expectedRent ?? 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <StyledInput value={form.expectedRent} onChange={v => set('expectedRent', v)} />
                    <Box
                      sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        px: 2, height: '40px', border: '1px solid #31a0e8', borderRadius: '8px',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        '&:hover': { bgcolor: 'rgba(49,160,232,0.06)' },
                      }}
                    >
                      <Typography sx={{ fontSize: '13px', color: '#31a0e8', fontWeight: 500 }}>套用最高上限</Typography>
                    </Box>
                  </Box>
                </Box>
                <FieldWrap label="押金" required half>
                  <StyledSelect value={form.deposit} onChange={v => set('deposit', v)} options={DEPOSIT_OPTIONS} placeholder="請選擇" />
                </FieldWrap>
              </Box>
              {/* 租金含括 + 管理費 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <MultiChips label="租金含括" options={RENT_INCLUDES_OPTIONS} selected={form.rentIncludes} onChange={v => set('rentIncludes', v)} />
                <FieldWrap label="管理費（每月）" half>
                  <StyledInput value={form.managementFee} onChange={v => set('managementFee', v)} />
                </FieldWrap>
              </Box>
              {/* 最短租期 + 可入住日期 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldWrap label="最短租期" required half>
                  <StyledSelect value={form.minLeasePeriod} onChange={v => set('minLeasePeriod', v)} options={MIN_LEASE_OPTIONS} placeholder="請選擇" />
                </FieldWrap>
                <FieldWrap label="可入住日期" half>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    value={form.availableDate ?? ''}
                    onChange={e => set('availableDate', e.target.value)}
                    sx={inputSx}
                  />
                </FieldWrap>
              </Box>
            </Box>
          </SectionCard>

          {/* ── 管理營業員 ── */}
          <SectionCard title="管理營業員">
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FieldWrap label="分店">
                <StyledSelect value={form.branch} onChange={v => set('branch', v)} options={BRANCH_OPTIONS} placeholder="全部" />
              </FieldWrap>
              <FieldWrap label="部門">
                <StyledSelect value={form.department} onChange={v => set('department', v)} options={DEPARTMENT_OPTIONS} placeholder="全部" />
              </FieldWrap>
              <FieldWrap label="業務員">
                <StyledInput value={form.salesPerson} onChange={v => set('salesPerson', v)} placeholder="搜尋名稱" />
              </FieldWrap>
            </Box>
          </SectionCard>

        </Box>
      </Box>

      {/* ── 底部 FAB 區域 ── */}
      <Box sx={{ position: 'fixed', bottom: 32, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        {/* 捲動至頂 */}
        <Fab
          color="primary"
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ bgcolor: '#31a0e8', boxShadow: '0px 1px 18px rgba(0,0,0,0.12), 0px 6px 10px rgba(0,0,0,0.14), 0px 3px 5px -1px rgba(0,0,0,0.2)' }}
        >
          <MdArrowUpward size={24} />
        </Fab>
        {/* 儲存 */}
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
        {/* 出租人資料 → */}
        <Fab
          variant="extended"
          onClick={() => navigate(`/active-rentals/${id}/landlord`)}
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
          出租人資料
          <MdArrowForwardIos size={18} />
        </Fab>
      </Box>
    </Box>
  );
}

// ─── 謄本欄位群組（可複用） ────────────────────────────────────────────────────

function AddressRow({ form, set }: { form: PropertyFormData; set: <K extends keyof PropertyFormData>(k: K, v: PropertyFormData[K]) => void }) {
  return (
    <Box>
      <FieldLabel label="門牌地址" required />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField value={form.addressZip ?? ''} onChange={e => set('addressZip', e.target.value)} size="small" placeholder="郵遞區號" sx={{ ...inputSx, width: '100px' }} />
        <Select value={form.addressCity ?? ''} onChange={e => set('addressCity', e.target.value)} displayEmpty size="small" sx={{ ...selectSx, width: '120px' }}>
          <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>縣市</MenuItem>
          {['台北市', '新北市', '桃園市', '台中市', '高雄市'].map(c => <MenuItem key={c} value={c} sx={{ fontSize: '14px' }}>{c}</MenuItem>)}
        </Select>
        <Select value={form.addressDistrict ?? ''} onChange={e => set('addressDistrict', e.target.value)} displayEmpty size="small" sx={{ ...selectSx, width: '120px' }}>
          <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>區域</MenuItem>
          {['板橋區', '中和區', '新莊區', '三重區', '永和區'].map(d => <MenuItem key={d} value={d} sx={{ fontSize: '14px' }}>{d}</MenuItem>)}
        </Select>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '160px' }}>
          <TextField
            value={form.addressStreet ?? ''}
            onChange={e => set('addressStreet', e.target.value)}
            size="small"
            placeholder="路段"
            fullWidth
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: <MdFolderOpen size={18} color="rgba(36,53,82,0.4)" style={{ flexShrink: 0 }} />,
              },
            }}
          />
        </Box>
        <TextField value={form.addressDetail ?? ''} onChange={e => set('addressDetail', e.target.value)} size="small" placeholder="巷弄號樓" sx={{ ...inputSx, width: '140px' }} />
        <IconButton size="small" sx={{ color: 'rgba(36,53,82,0.5)' }}><MdLocationOn size={20} /></IconButton>
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            px: 1.5, height: '37px', border: '1px solid #faaf00', borderRadius: '8px',
            cursor: 'pointer', whiteSpace: 'nowrap',
            '&:hover': { bgcolor: 'rgba(250,175,0,0.06)' },
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#faaf00' }}>地址檢查</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function LotHouseRow({ form, set }: { form: PropertyFormData; set: <K extends keyof PropertyFormData>(k: K, v: PropertyFormData[K]) => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <FieldLabel label="坐落地號" required />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StyledInput value={form.lotMain} onChange={v => set('lotMain', v)} placeholder="0000" />
          <Typography sx={{ fontSize: '14px', color: '#124a57' }}>-</Typography>
          <StyledInput value={form.lotSub} onChange={v => set('lotSub', v)} placeholder="00000" />
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <FieldLabel label="建號" required />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StyledInput value={form.houseNoMain} onChange={v => set('houseNoMain', v)} placeholder="00000" />
          <Typography sx={{ fontSize: '14px', color: '#124a57' }}>-</Typography>
          <StyledInput value={form.houseNoSub} onChange={v => set('houseNoSub', v)} placeholder="000" />
        </Box>
      </Box>
    </Box>
  );
}

function CoordAreaRow({ form, set }: { form: PropertyFormData; set: <K extends keyof PropertyFormData>(k: K, v: PropertyFormData[K]) => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FieldWrap label="地址座標 (x)" required half>
        <StyledInput value={form.coordX} onChange={v => set('coordX', v)} />
      </FieldWrap>
      <FieldWrap label="地址座標 (y)" required half>
        <StyledInput value={form.coordY} onChange={v => set('coordY', v)} />
      </FieldWrap>
    </Box>
  );
}

function ShareRow({ form, set }: { form: PropertyFormData; set: <K extends keyof PropertyFormData>(k: K, v: PropertyFormData[K]) => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FieldWrap label="實際使用面積 (平方公尺)" required half>
        <StyledInput value={form.actualArea} onChange={v => set('actualArea', v)} />
      </FieldWrap>
      <FieldWrap half>
        <FieldLabel label="建物持分比" required />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StyledInput value={form.shareNumerator} onChange={v => set('shareNumerator', v)} placeholder="分子" />
          <Typography sx={{ fontSize: '14px', color: '#124a57', px: 0.5 }}>/</Typography>
          <StyledInput value={form.shareDenominator} onChange={v => set('shareDenominator', v)} placeholder="分母" />
        </Box>
      </FieldWrap>
    </Box>
  );
}
