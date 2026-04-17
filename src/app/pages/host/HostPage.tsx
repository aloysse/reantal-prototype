import { useState } from 'react';
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { MdFolderOpen, MdLocationOn, MdSave } from 'react-icons/md';
import SectionCard from '../../components/SectionCard';
import PageContainer from '../../components/PageContainer';

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

const CITY_OPTIONS = ['台北市', '新北市', '桃園市', '台中市', '高雄市'];
const DISTRICT_OPTIONS = ['板橋區', '中和區', '新莊區', '三重區', '永和區'];

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

function StyledInput({ value, onChange, placeholder }: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <TextField
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      sx={inputSx}
    />
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {children}
    </Box>
  );
}

interface CompanyForm {
  companyName: string;
  taxId: string;
  ownerName: string;
  licenseNumber: string;
  address: AddressValue;
  phone: string;
  email: string;
}

interface AgentForm {
  name: string;
  certNumber: string;
  address: AddressValue;
  phone: string;
  email: string;
}

interface ManagerForm {
  name: string;
  certNumber: string;
  address: AddressValue;
  phone: string;
}

interface AddressValue {
  zip: string;
  city: string;
  district: string;
  street: string;
  detail: string;
}

function AddressFields({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: AddressValue;
  onChange: (v: AddressValue) => void;
  prefix?: React.ReactNode;
}) {
  const set = (key: keyof AddressValue, v: string) => onChange({ ...value, [key]: v });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {prefix}
        <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)', lineHeight: '22px' }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          value={value.zip}
          onChange={e => set('zip', e.target.value)}
          size="small"
          placeholder="郵遞區號"
          sx={{ ...inputSx, width: '100px' }}
        />
        <Select
          value={value.city}
          onChange={e => set('city', e.target.value)}
          displayEmpty
          size="small"
          sx={{ ...selectSx, width: '120px' }}
        >
          <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>縣市</MenuItem>
          {CITY_OPTIONS.map(city => (
            <MenuItem key={city} value={city} sx={{ fontSize: '14px' }}>{city}</MenuItem>
          ))}
        </Select>
        <Select
          value={value.district}
          onChange={e => set('district', e.target.value)}
          displayEmpty
          size="small"
          sx={{ ...selectSx, width: '120px' }}
        >
          <MenuItem value="" disabled sx={{ fontSize: '14px', color: 'rgba(0,0,0,0.38)' }}>區域</MenuItem>
          {DISTRICT_OPTIONS.map(district => (
            <MenuItem key={district} value={district} sx={{ fontSize: '14px' }}>{district}</MenuItem>
          ))}
        </Select>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '160px' }}>
          <TextField
            value={value.street}
            onChange={e => set('street', e.target.value)}
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
        <TextField
          value={value.detail}
          onChange={e => set('detail', e.target.value)}
          size="small"
          placeholder="巷弄號樓"
          sx={{ ...inputSx, flex: 1, minWidth: '160px' }}
        />
        <IconButton size="small" sx={{ color: 'rgba(36,53,82,0.5)' }}>
          <MdLocationOn size={20} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function HostPage() {
  const [company, setCompany] = useState<CompanyForm>({
    companyName: '都營不動產開發股份有限公司',
    taxId: '80617344',
    ownerName: '陳興義',
    licenseNumber: '(111) 新北租登字第0236號(換發)',
    address: {
      zip: '234',
      city: '新北市',
      district: '永和區',
      street: '中和路',
      detail: '453號1樓',
    },
    phone: '02-2929-0112',
    email: 'dowinrentalservice@hotmail.com',
  });

  const [agent, setAgent] = useState<AgentForm>({
    name: '邵育緒',
    certNumber: '(91) 北縣字第000354號(換發)',
    address: {
      zip: '235',
      city: '新北市',
      district: '中和區',
      street: '中和路',
      detail: '358號9樓',
    },
    phone: '02-2929-0112',
    email: 'dowinrentalservice@hotmail.com',
  });

  const [manager, setManager] = useState<ManagerForm>({
    name: '謝孟璇',
    certNumber: '(113)登字第019645號',
    address: {
      zip: '235',
      city: '新北市',
      district: '中和區',
      street: '中和路',
      detail: '358號9樓',
    },
    phone: '02-2929-0112',
  });

  const sameAsCompanyBtnSx = {
    bgcolor: '#31a0e8',
    color: '#fff',
    fontSize: '12px',
    height: '26px',
    px: 1,
    minWidth: 0,
    borderRadius: '6px',
    '&:hover': { bgcolor: '#2090d8' },
  } as const;

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 600, color: '#124a57' }}>
          業者資料
        </Typography>
        <Button
          variant="contained"
          startIcon={<MdSave size={18} />}
          sx={{
            bgcolor: '#31a0e8',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            px: 3,
            height: '40px',
            '&:hover': { bgcolor: '#2288cc' },
          }}
        >
          儲存
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 公司基本資料 */}
        <SectionCard title="公司基本資料">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FieldRow>
              <FieldWrap label="公司名稱" required half>
                <StyledInput value={company.companyName} onChange={v => setCompany(p => ({ ...p, companyName: v }))} />
              </FieldWrap>
              <FieldWrap label="統一編號" required half>
                <StyledInput value={company.taxId} onChange={v => setCompany(p => ({ ...p, taxId: v }))} />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap label="負責人姓名" required half>
                <StyledInput value={company.ownerName} onChange={v => setCompany(p => ({ ...p, ownerName: v }))} />
              </FieldWrap>
              <FieldWrap label="許可字號／登記證字號" half>
                <StyledInput value={company.licenseNumber} onChange={v => setCompany(p => ({ ...p, licenseNumber: v }))} />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap>
                <AddressFields label="營業地址" value={company.address} onChange={v => setCompany(p => ({ ...p, address: v }))} />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap label="聯絡電話" half>
                <StyledInput value={company.phone} onChange={v => setCompany(p => ({ ...p, phone: v }))} />
              </FieldWrap>
              <FieldWrap label="電子郵件信箱" half>
                <StyledInput value={company.email} onChange={v => setCompany(p => ({ ...p, email: v }))} />
              </FieldWrap>
            </FieldRow>
          </Box>
        </SectionCard>

        {/* 不動產經紀人 */}
        <SectionCard title="不動產經紀人">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FieldRow>
              <FieldWrap label="姓名" required half>
                <StyledInput value={agent.name} onChange={v => setAgent(p => ({ ...p, name: v }))} />
              </FieldWrap>
              <FieldWrap label="證書字號" half>
                <StyledInput value={agent.certNumber} onChange={v => setAgent(p => ({ ...p, certNumber: v }))} />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap>
                <AddressFields
                  label="通訊住址"
                  value={agent.address}
                  onChange={v => setAgent(p => ({ ...p, address: v }))}
                  prefix={
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setAgent(p => ({ ...p, address: { ...company.address } }))}
                      sx={sameAsCompanyBtnSx}
                    >
                      同公司資料
                    </Button>
                  }
                />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap half>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setAgent(p => ({ ...p, phone: company.phone }))}
                    sx={sameAsCompanyBtnSx}
                  >
                    同公司資料
                  </Button>
                  <FieldLabel label="聯絡電話" />
                </Box>
                <StyledInput value={agent.phone} onChange={v => setAgent(p => ({ ...p, phone: v }))} />
              </FieldWrap>
              <FieldWrap half>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setAgent(p => ({ ...p, email: company.email }))}
                    sx={sameAsCompanyBtnSx}
                  >
                    同公司資料
                  </Button>
                  <FieldLabel label="電子郵件信箱" />
                </Box>
                <StyledInput value={agent.email} onChange={v => setAgent(p => ({ ...p, email: v }))} />
              </FieldWrap>
            </FieldRow>
          </Box>
        </SectionCard>

        {/* 租賃住宅管理人員 */}
        <SectionCard title="租賃住宅管理人員">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FieldRow>
              <FieldWrap label="姓名" required half>
                <StyledInput value={manager.name} onChange={v => setManager(p => ({ ...p, name: v }))} />
              </FieldWrap>
              <FieldWrap label="證書字號" half>
                <StyledInput value={manager.certNumber} onChange={v => setManager(p => ({ ...p, certNumber: v }))} />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap>
                <AddressFields
                  label="通訊住址"
                  value={manager.address}
                  onChange={v => setManager(p => ({ ...p, address: v }))}
                  prefix={
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setManager(p => ({ ...p, address: { ...company.address } }))}
                      sx={sameAsCompanyBtnSx}
                    >
                      同公司資料
                    </Button>
                  }
                />
              </FieldWrap>
            </FieldRow>
            <FieldRow>
              <FieldWrap half>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setManager(p => ({ ...p, phone: company.phone }))}
                    sx={sameAsCompanyBtnSx}
                  >
                    同公司資料
                  </Button>
                  <FieldLabel label="聯絡電話" />
                </Box>
                <StyledInput value={manager.phone} onChange={v => setManager(p => ({ ...p, phone: v }))} />
              </FieldWrap>
            </FieldRow>
          </Box>
        </SectionCard>
      </Box>
    </PageContainer>
  );
}
