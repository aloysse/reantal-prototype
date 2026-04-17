import { useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  Radio,
  RadioGroup,
  FormControlLabel,
  Pagination,
  Chip,
} from '@mui/material';
import {
  MdExpandMore,
  MdExpandLess,
  MdFileUpload,
  MdAutoFixHigh,
  MdClose,
  MdAdd,
  MdManageSearch,
  MdSearch,
  MdCheckCircle,
  MdDelete,
  MdLocationOn,
  MdFolderOpen,
} from 'react-icons/md';
import {
  properties,
  landlords,
  type Landlord,
  type LandlordAddress,
  type LandlordAgent,
  type LandlordPersonType,
  type PropertyType,
} from '../../data/mockData';

// ─── 常數 ────────────────────────────────────────────────────────────────────

const CITY_OPTIONS = ['台北市', '新北市', '桃園市', '台中市', '高雄市'];
const DISTRICT_OPTIONS = ['板橋區', '中和區', '新莊區', '三重區', '永和區', '大同區', '大安區', '信義區'];

// ─── 樣式常數 ────────────────────────────────────────────────────────────────

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

// ─── 共用子元件 ───────────────────────────────────────────────────────────────

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

function StyledInput({ value, onChange, placeholder, fullWidth, type }: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  type?: string;
}) {
  return (
    <TextField
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth={fullWidth !== false}
      type={type}
      sx={inputSx}
    />
  );
}

function BinaryToggle({ value, options, onChange }: {
  value?: string;
  options: { label: string; value: string }[];
  onChange?: (v: string) => void;
}) {
  return (
    <Box sx={{ display: 'inline-flex', border: '1px solid #31a0e8', borderRadius: '8px', overflow: 'hidden', height: '37px' }}>
      {options.map((opt, i) => (
        <Box
          key={opt.value}
          onClick={() => onChange?.(opt.value)}
          sx={{
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: value === opt.value ? '#31a0e8' : '#ffffff',
            borderLeft: i > 0 ? '1px solid #31a0e8' : 'none',
            cursor: 'pointer',
            minWidth: '60px',
            '&:hover': { bgcolor: value === opt.value ? '#2090d8' : 'rgba(49,160,232,0.06)' },
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: value === opt.value ? '#ffffff' : '#31a0e8', userSelect: 'none' }}>
            {opt.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── ImageUpload ─────────────────────────────────────────────────────────────

function ImageUpload({ label, required }: { label?: string; required?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Box>
      {label && <FieldLabel label={label} required={required} />}
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          width: '100%',
          minHeight: '140px',
          border: '1px solid rgba(0,0,0,0.23)',
          borderRadius: '8px',
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          overflow: 'hidden',
          '&:hover': { borderColor: 'rgba(0,0,0,0.4)' },
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, py: 1 }}>
          <MdFileUpload size={24} color="rgba(36,53,82,0.4)" />
          <Typography sx={{ fontSize: '16px', color: 'rgba(36,53,82,0.6)' }}>上傳圖片</Typography>
        </Box>
        <Box sx={{
          width: '100%',
          height: '28px',
          bgcolor: '#e8f6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          borderRadius: '0 0 8px 8px',
        }}>
          <MdAutoFixHigh size={16} color="#0173bd" />
          <Typography sx={{ fontSize: '12px', color: '#0173bd' }}>提供智慧解析，自動帶入資料</Typography>
        </Box>
      </Box>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} />
    </Box>
  );
}

// ─── AddressFields ────────────────────────────────────────────────────────────

function AddressFields({
  label,
  required,
  value,
  onChange,
  prefix,
}: {
  label: string;
  required?: boolean;
  value?: LandlordAddress;
  onChange?: (v: LandlordAddress) => void;
  prefix?: React.ReactNode;
}) {
  const set = (k: keyof LandlordAddress, v: string) => onChange?.({ ...value, [k]: v });
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {prefix}
        <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)', lineHeight: '22px' }}>
          {label}
          {required && <span style={{ color: '#fc4b6c', marginLeft: 2 }}>*</span>}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          value={value?.zip ?? ''}
          onChange={e => set('zip', e.target.value)}
          size="small"
          placeholder="郵遞區號"
          sx={{ ...inputSx, width: '110px' }}
        />
        <Select
          value={value?.city ?? ''}
          onChange={e => set('city', e.target.value)}
          displayEmpty
          size="small"
          sx={{ ...selectSx, width: '120px' }}
        >
          <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>縣市</MenuItem>
          {CITY_OPTIONS.map(c => <MenuItem key={c} value={c} sx={{ fontSize: '14px' }}>{c}</MenuItem>)}
        </Select>
        <Select
          value={value?.district ?? ''}
          onChange={e => set('district', e.target.value)}
          displayEmpty
          size="small"
          sx={{ ...selectSx, width: '120px' }}
        >
          <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>區域</MenuItem>
          {DISTRICT_OPTIONS.map(d => <MenuItem key={d} value={d} sx={{ fontSize: '14px' }}>{d}</MenuItem>)}
        </Select>
        <TextField
          value={value?.street ?? ''}
          onChange={e => set('street', e.target.value)}
          size="small"
          placeholder="路段"
          sx={{ ...inputSx, flex: 1, minWidth: '140px' }}
          slotProps={{
            input: {
              endAdornment: <MdFolderOpen size={18} color="rgba(36,53,82,0.4)" style={{ flexShrink: 0 }} />,
            },
          }}
        />
        <TextField
          value={value?.detail ?? ''}
          onChange={e => set('detail', e.target.value)}
          size="small"
          placeholder="巷弄號樓"
          sx={{ ...inputSx, width: '140px' }}
          slotProps={{
            input: {
              endAdornment: <MdLocationOn size={18} color="rgba(36,53,82,0.4)" style={{ flexShrink: 0 }} />,
            },
          }}
        />
      </Box>
    </Box>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  isGreen,
  defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  isGreen?: boolean;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '16px',
        boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
        bgcolor: isGreen ? '#fafffb' : '#fafafa',
        border: isGreen ? '1px solid #81d394' : 'none',
        width: '100%',
      }}
    >
      {/* 標題列 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 3 : 0 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          borderLeft: `8px solid ${isGreen ? '#81d394' : '#31a0e8'}`,
          pl: 2,
        }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57', lineHeight: 1.167 }}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(e => !e)}>
          {expanded ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </IconButton>
      </Box>
      {expanded && children}
    </Box>
  );
}

// ─── SelectLandlordSourceModal ────────────────────────────────────────────────

function SelectLandlordSourceModal({
  open,
  onClose,
  onCreateNew,
  onSelectExisting,
}: {
  open: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onSelectExisting: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px', p: 4, boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)' } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57' }}>選擇來源</Typography>
        <IconButton size="small" onClick={onClose}><MdClose size={22} /></IconButton>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<MdAdd size={18} />}
          onClick={onCreateNew}
          fullWidth
          sx={{
            borderColor: '#31a0e8',
            color: '#31a0e8',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            py: 1.25,
            '&:hover': { borderColor: '#2090d8', bgcolor: 'rgba(49,160,232,0.06)' },
          }}
        >
          建立新出租人
        </Button>
        <Button
          variant="contained"
          startIcon={<MdManageSearch size={18} />}
          onClick={onSelectExisting}
          fullWidth
          sx={{
            bgcolor: '#31a0e8',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            py: 1.25,
            boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: '#2090d8' },
          }}
        >
          選擇現有出租人
        </Button>
      </Box>
    </Dialog>
  );
}

// ─── SelectExistingLandlordModal ──────────────────────────────────────────────

function SelectExistingLandlordModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (landlord: Landlord) => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string>('');
  const [page, setPage] = useState(1);

  const filtered = landlords.filter(l =>
    !search || l.name.includes(search) || l.phone.includes(search)
  );
  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedLandlord = landlords.find(l => l.id === selected);

  const handleConfirm = () => {
    if (selectedLandlord) {
      onConfirm(selectedLandlord);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px', p: 4, boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)' } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57' }}>選擇出租人</Typography>
        <IconButton size="small" onClick={onClose}><MdClose size={22} /></IconButton>
      </Box>

      {/* 搜尋列 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <TextField
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="關鍵字搜尋"
          size="small"
          sx={{ ...inputSx, width: '220px' }}
        />
        <Button
          variant="contained"
          startIcon={<MdSearch size={18} />}
          sx={{
            bgcolor: '#31a0e8',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            height: '37px',
            boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: '#2090d8' },
          }}
        >
          搜尋
        </Button>
      </Box>

      {/* 表格標題 */}
      <Box sx={{ display: 'flex', gap: 1, px: 2, py: 0.5, borderBottom: '1px solid rgba(36,53,82,0.35)' }}>
        <Box sx={{ width: '38px' }} />
        <Typography sx={{ flex: 1, fontSize: '14px', color: 'rgba(36,53,82,0.6)', fontWeight: 500 }}>姓名</Typography>
        <Typography sx={{ width: '160px', fontSize: '14px', color: 'rgba(36,53,82,0.6)', fontWeight: 500 }}>身份</Typography>
        <Typography sx={{ width: '200px', fontSize: '14px', color: 'rgba(36,53,82,0.6)', fontWeight: 500 }}>電話</Typography>
      </Box>

      {/* 列表 */}
      <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
        {paged.map(l => (
          <Box
            key={l.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderBottom: '1px solid rgba(36,53,82,0.35)',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(49,160,232,0.04)' },
            }}
            onClick={() => setSelected(l.id)}
          >
            <FormControlLabel
              value={l.id}
              control={<Radio size="small" color="primary" sx={{ p: '9px' }} />}
              label=""
              sx={{ m: 0 }}
            />
            <Typography sx={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#124a57' }}>
              {l.personType === 'legal' ? l.companyName : l.name}
            </Typography>
            <Box sx={{ width: '160px' }}>
              <Chip
                label={l.personType === 'natural' ? '自然人' : '法人'}
                size="small"
                sx={{
                  bgcolor: l.personType === 'natural' ? '#8dde85' : '#8794eb',
                  color: '#ffffff',
                  fontSize: '12px',
                  height: '24px',
                  borderRadius: '90px',
                }}
              />
            </Box>
            <Typography sx={{ width: '200px', fontSize: '12px', color: '#124a57' }}>
              {l.dayPhone ?? l.phone}
            </Typography>
          </Box>
        ))}
      </RadioGroup>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, v) => setPage(v)}
          size="small"
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* 底部確認 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, pt: 3 }}>
        {selectedLandlord && (
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            <span style={{ color: 'rgba(36,53,82,0.6)' }}>已選擇</span>
            {` ${selectedLandlord.personType === 'legal' ? selectedLandlord.companyName : selectedLandlord.name}`}
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={<MdCheckCircle size={18} />}
          onClick={handleConfirm}
          disabled={!selected}
          sx={{
            bgcolor: '#31a0e8',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            height: '37px',
            boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: '#2090d8' },
          }}
        >
          確認
        </Button>
      </Box>
    </Dialog>
  );
}

// ─── LandlordBasicInfoCard ────────────────────────────────────────────────────

function LandlordBasicInfoCard({
  landlord,
  onChange,
}: {
  landlord: Landlord;
  onChange: (updated: Landlord) => void;
}) {
  const set = <K extends keyof Landlord>(k: K, v: Landlord[K]) => onChange({ ...landlord, [k]: v });
  const sameAsAbove = landlord.mailingAddress?.zip === landlord.domicileAddress?.zip &&
    landlord.mailingAddress?.city === landlord.domicileAddress?.city &&
    landlord.mailingAddress?.district === landlord.domicileAddress?.district &&
    landlord.mailingAddress?.street === landlord.domicileAddress?.street &&
    landlord.mailingAddress?.detail === landlord.domicileAddress?.detail;

  return (
    <SectionCard title="出租人基本資料">
      {/* 身份類型切換 */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)', mb: 1 }}>身份類型</Typography>
        <BinaryToggle
          value={landlord.personType}
          options={[{ label: '自然人', value: 'natural' }, { label: '私法人', value: 'legal' }]}
          onChange={v => set('personType', v as LandlordPersonType)}
        />
      </Box>

      {landlord.personType === 'natural' ? (
        /* ── 自然人 ── */
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* 左側：證件上傳 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '220px', flexShrink: 0 }}>
            <ImageUpload label="身分證正面" required />
            <ImageUpload label="身分證反面" required />
          </Box>

          {/* 右側：欄位 */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 性別 + 姓名 */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <Box sx={{ flexShrink: 0 }}>
                <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)', mb: 1 }}>性別</Typography>
                <BinaryToggle
                  value={landlord.gender ?? 'male'}
                  options={[{ label: '男', value: 'male' }, { label: '女', value: 'female' }]}
                  onChange={v => set('gender', v as 'male' | 'female')}
                />
              </Box>
              <FieldWrap label="姓名" required>
                <StyledInput value={landlord.name} onChange={v => set('name', v)} />
              </FieldWrap>
            </Box>

            {/* 身分證字號 + 出生日期 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FieldWrap label="身分證字號" required half>
                <StyledInput value={landlord.idNumber} onChange={v => set('idNumber', v)} />
              </FieldWrap>
              <FieldWrap label="出生日期" required half>
                <StyledInput value={landlord.dob} onChange={v => set('dob', v)} placeholder="YYYY-MM-DD" type="date" />
              </FieldWrap>
            </Box>

            {/* 市話日 + 市話夜 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FieldWrap label="市話 (日)" required half>
                <StyledInput value={landlord.dayPhone} onChange={v => set('dayPhone', v)} />
              </FieldWrap>
              <FieldWrap label="市話 (夜)" half>
                <StyledInput value={landlord.nightPhone} onChange={v => set('nightPhone', v)} />
              </FieldWrap>
            </Box>

            {/* 手機 + Email */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FieldWrap label="手機" half>
                <StyledInput value={landlord.phone} onChange={v => set('phone', v)} />
              </FieldWrap>
              <FieldWrap label="Email" half>
                <StyledInput value={landlord.email} onChange={v => set('email', v)} />
              </FieldWrap>
            </Box>

            {/* 戶籍地址 */}
            <AddressFields
              label="戶籍地址"
              required
              value={landlord.domicileAddress}
              onChange={v => set('domicileAddress', v)}
            />

            {/* 通訊地址 */}
            <AddressFields
              label="通訊地址"
              required
              value={landlord.mailingAddress}
              onChange={v => set('mailingAddress', v)}
              prefix={
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => set('mailingAddress', { ...landlord.domicileAddress })}
                  sx={{
                    bgcolor: sameAsAbove ? '#31a0e8' : '#31a0e8',
                    color: '#fff',
                    fontSize: '12px',
                    height: '26px',
                    px: 1,
                    minWidth: 0,
                    borderRadius: '6px',
                    '&:hover': { bgcolor: '#2090d8' },
                  }}
                >
                  同上
                </Button>
              }
            />
          </Box>
        </Box>
      ) : (
        /* ── 私法人 ── */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            {/* 左側：公司登記影本 */}
            <Box sx={{ width: '220px', flexShrink: 0 }}>
              <ImageUpload label="公司登記事項表影本" required />
            </Box>

            {/* 右側：公司資料 */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldWrap label="法人名稱" required half>
                  <StyledInput value={landlord.companyName} onChange={v => set('companyName', v)} />
                </FieldWrap>
                <FieldWrap label="代表人" required half>
                  <StyledInput value={landlord.representative} onChange={v => set('representative', v)} />
                </FieldWrap>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FieldWrap label="統一編號" required half>
                  <StyledInput value={landlord.taxId} onChange={v => set('taxId', v)} />
                </FieldWrap>
                <FieldWrap label="市話 (日)" required half>
                  <StyledInput value={landlord.dayPhone} onChange={v => set('dayPhone', v)} />
                </FieldWrap>
              </Box>
              <AddressFields
                label="登記地址"
                required
                value={landlord.registrationAddress}
                onChange={v => set('registrationAddress', v)}
              />
            </Box>
          </Box>

          {/* 身分證（代表人）正反面 */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <ImageUpload label="身分證正面" required />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ImageUpload label="身分證反面" required />
            </Box>
          </Box>
        </Box>
      )}
    </SectionCard>
  );
}

// ─── LandlordBankInfoCard ─────────────────────────────────────────────────────

function LandlordBankInfoCard({
  landlord,
  onChange,
}: {
  landlord: Landlord;
  onChange: (updated: Landlord) => void;
}) {
  const set = <K extends keyof Landlord>(k: K, v: Landlord[K]) => onChange({ ...landlord, [k]: v });
  return (
    <SectionCard title="出租人匯款資料">
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {/* 左側：存摺影本 */}
        <Box sx={{ width: '220px', flexShrink: 0 }}>
          <ImageUpload label="存摺影本" required />
        </Box>

        {/* 右側：帳戶資料 */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FieldWrap label="戶名稱" required half>
              <StyledInput value={landlord.bankHolderName} onChange={v => set('bankHolderName', v)} />
            </FieldWrap>
            <FieldWrap label="身分證字號" required half>
              <StyledInput value={landlord.bankHolderIdNumber} onChange={v => set('bankHolderIdNumber', v)} />
            </FieldWrap>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FieldWrap label="金融單位" required>
              <StyledInput value={landlord.bankInstitution} onChange={v => set('bankInstitution', v)} />
            </FieldWrap>
            <FieldWrap label="分行名稱" required>
              <StyledInput value={landlord.bankBranchName} onChange={v => set('bankBranchName', v)} />
            </FieldWrap>
            <FieldWrap label="分行代碼" required>
              <StyledInput value={landlord.bankBranchCode} onChange={v => set('bankBranchCode', v)} />
            </FieldWrap>
          </Box>
          <FieldWrap label="帳戶號碼" required>
            <StyledInput value={landlord.bankAccountNo} onChange={v => set('bankAccountNo', v)} />
          </FieldWrap>
        </Box>
      </Box>
    </SectionCard>
  );
}

// ─── LandlordAgentCard（社宅專用） ─────────────────────────────────────────────

function LandlordAgentCard({
  agents,
  onChange,
}: {
  agents: LandlordAgent[];
  onChange: (agents: LandlordAgent[]) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const addAgent = () => {
    onChange([...agents, {
      id: `ag${Date.now()}`,
      name: '',
      idNumber: '',
      phone: '',
    }]);
  };
  const removeAgent = (id: string) => onChange(agents.filter(a => a.id !== id));
  const updateAgent = (id: string, updated: Partial<LandlordAgent>) => {
    onChange(agents.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '16px',
        boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
        bgcolor: '#fafffb',
        border: '1px solid #81d394',
        width: '100%',
      }}
    >
      {/* 標題列 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 3 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '8px solid #81d394', pl: 2 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57', lineHeight: 1.167 }}>
            代理人資訊
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(e => !e)}>
          {expanded ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </IconButton>
      </Box>

      {expanded && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 新增代理人按鈕 */}
          <Box>
            <Button
              variant="contained"
              startIcon={<MdAdd size={18} />}
              onClick={addAgent}
              sx={{
                bgcolor: '#81d394',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                height: '37px',
                boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: '#6bc97c' },
              }}
            >
              新增代理人
            </Button>
          </Box>

          {/* 代理人列表 */}
          {agents.map((agent, idx) => (
            <Box key={agent.id} sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
              {/* 左側：證件上傳 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '220px', flexShrink: 0 }}>
                <ImageUpload label="身分證正面" required />
                <ImageUpload label="身分證反面" required />
              </Box>

              {/* 右側：欄位 */}
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#124a57' }}>
                  代理人 {idx + 1}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FieldWrap label="姓名" required half>
                    <StyledInput value={agent.name} onChange={v => updateAgent(agent.id, { name: v })} />
                  </FieldWrap>
                  <FieldWrap label="身分證字號" required half>
                    <StyledInput value={agent.idNumber} onChange={v => updateAgent(agent.id, { idNumber: v })} />
                  </FieldWrap>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FieldWrap label="手機" required half>
                    <StyledInput value={agent.phone} onChange={v => updateAgent(agent.id, { phone: v })} />
                  </FieldWrap>
                  <FieldWrap label="市話 (日)" half>
                    <StyledInput value={agent.dayPhone} onChange={v => updateAgent(agent.id, { dayPhone: v })} />
                  </FieldWrap>
                </Box>

                <AddressFields
                  label="戶籍地址"
                  required
                  value={agent.address}
                  onChange={v => updateAgent(agent.id, { address: v })}
                />

                {/* 刪除按鈕 */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<MdDelete size={16} />}
                    onClick={() => removeAgent(agent.id)}
                    sx={{
                      borderColor: '#81d394',
                      color: '#81d394',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      height: '37px',
                      '&:hover': { borderColor: '#6bc97c', bgcolor: 'rgba(129,211,148,0.06)' },
                    }}
                  >
                    刪除
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ─── 主頁面 ───────────────────────────────────────────────────────────────────

export default function ActiveRentalLandlordPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const isNew = id === 'new';
  const property = isNew ? null : properties.find(p => p.id === id);
  const propertyType: PropertyType = isNew
    ? (searchParams.get('type') as PropertyType ?? 'social')
    : (property?.type ?? 'social');
  const isSocial = propertyType === 'social';
  const statusTags = isNew ? [{ date: '', label: 'New' }] : (property?.statusTags ?? []);

  const initialLandlord = isNew ? null : (landlords.find(l => l.id === property?.landlordId) ?? null);
  const [currentLandlord, setCurrentLandlord] = useState<Landlord | null>(initialLandlord);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);

  const hasLandlord = !!currentLandlord;

  const handleSelectExisting = (landlord: Landlord) => {
    setCurrentLandlord({ ...landlord });
    setShowSelectModal(false);
    setShowSourceModal(false);
  };

  const handleCreateNew = () => {
    setCurrentLandlord({
      id: `l_new_${Date.now()}`,
      name: '',
      phone: '',
      idNumber: '',
      personType: 'natural',
    });
    setShowSourceModal(false);
  };

  return (
    <Box sx={{ bgcolor: '#eef1f2', pb: '140px' }}>
      <Box sx={{ maxWidth: '1584px', mx: 'auto', px: 3, pt: 2 }}>

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

        {/* ── 空狀態 ── */}
        {!hasLandlord && (
          <Box
            sx={{
              bgcolor: '#fafafa',
              borderRadius: '16px',
              boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
              height: '600px',
              minHeight: '600px',
              p: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '16px', color: '#000', lineHeight: '24px' }}>
                此物件目前尚無出租人資料
              </Typography>
              <Button
                variant="contained"
                startIcon={<MdAdd size={18} />}
                onClick={() => setShowSourceModal(true)}
                sx={{
                  bgcolor: '#31a0e8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 2,
                  py: 1.25,
                  boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: '#2090d8' },
                }}
              >
                新增出租人
              </Button>
            </Box>
          </Box>
        )}

        {/* ── 有出租人：三個 Section ── */}
        {hasLandlord && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <LandlordBasicInfoCard landlord={currentLandlord!} onChange={setCurrentLandlord} />
            <LandlordBankInfoCard landlord={currentLandlord!} onChange={setCurrentLandlord} />
            {isSocial && (
              <LandlordAgentCard
                agents={currentLandlord!.agents ?? []}
                onChange={agents => setCurrentLandlord(l => l ? { ...l, agents } : l)}
              />
            )}
          </Box>
        )}

        </Box>{/* end sections */}
      </Box>

      {/* ── Modals ── */}
      <SelectLandlordSourceModal
        open={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        onCreateNew={handleCreateNew}
        onSelectExisting={() => { setShowSourceModal(false); setShowSelectModal(true); }}
      />
      <SelectExistingLandlordModal
        open={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        onConfirm={handleSelectExisting}
      />
    </Box>
  );
}
