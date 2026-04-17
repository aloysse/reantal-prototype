import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import {
  MdAdd,
  MdAutoFixHigh,
  MdFileUpload,
  MdOutlineCheck,
  MdEdit,
  MdDelete,
  MdSave,
  MdClose,
} from 'react-icons/md';
import { properties, tenants, type LandlordAddress, type Tenant } from '../../data/mockData';
import SectionCard from '../../components/SectionCard';

const CITY_OPTIONS = ['台北市', '新北市', '桃園市', '台中市', '高雄市'];
const DISTRICT_OPTIONS = ['板橋區', '中和區', '新莊區', '三重區', '永和區', '大同區', '大安區', '信義區'];

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

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: '12px', color: 'rgba(36,53,82,0.6)', lineHeight: '20px', mb: 0.5 }}>
      {label}
      {required && <span style={{ color: '#fc4b6c', marginLeft: 2 }}>*</span>}
    </Typography>
  );
}

function TinyText({ children }: { children: React.ReactNode }) {
  return <Typography sx={{ fontSize: '12px', color: '#124a57', lineHeight: '20px' }}>{children}</Typography>;
}

function ImageUploadBox({ label, required }: { label: string; required?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Box>
      <FieldLabel label={label} required={required} />
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: '1px solid rgba(36,53,82,0.2)',
          borderRadius: '8px',
          overflow: 'hidden',
          bgcolor: '#fff',
          cursor: 'pointer',
          height: '212px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <MdFileUpload size={18} color="rgba(36,53,82,0.45)" />
          <Typography sx={{ fontSize: '12px', color: 'rgba(36,53,82,0.6)' }}>上傳圖片</Typography>
        </Box>
        <Box sx={{ height: '22px', bgcolor: '#e8f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <MdAutoFixHigh size={12} color="#0173bd" />
          <Typography sx={{ fontSize: '10px', color: '#0173bd' }}>提供智慧解析，自動帶入資料</Typography>
        </Box>
      </Box>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} />
    </Box>
  );
}

function AddressRow({
  value,
  onChange,
  required,
  withSameButton,
  onCopy,
}: {
  value?: LandlordAddress;
  onChange: (v: LandlordAddress) => void;
  required?: boolean;
  withSameButton?: boolean;
  onCopy?: () => void;
}) {
  const set = (k: keyof LandlordAddress, v: string) => onChange({ ...value, [k]: v });
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        {withSameButton && (
          <Button
            size="small"
            onClick={onCopy}
            sx={{
              minWidth: '60px',
              height: '37px',
              border: '1px solid #31a0e8',
              color: '#31a0e8',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          >
            同上
          </Button>
        )}
        <FieldLabel label={withSameButton ? '通訊地址' : '戶籍地址'} required={required} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField value={value?.zip ?? ''} onChange={e => set('zip', e.target.value)} placeholder="郵遞區號" sx={{ ...inputSx, width: '120px' }} />
        <TextField value={value?.city ?? ''} onChange={e => set('city', e.target.value)} placeholder={CITY_OPTIONS[1]} sx={{ ...inputSx, width: '140px' }} />
        <TextField value={value?.district ?? ''} onChange={e => set('district', e.target.value)} placeholder={DISTRICT_OPTIONS[0]} sx={{ ...inputSx, width: '140px' }} />
        <TextField value={value?.street ?? ''} onChange={e => set('street', e.target.value)} placeholder="路段" sx={{ ...inputSx, flex: 1 }} />
        <TextField value={value?.detail ?? ''} onChange={e => set('detail', e.target.value)} placeholder="號段" sx={{ ...inputSx, width: '200px' }} />
      </Box>
    </Box>
  );
}

function TextInput({
  label,
  required,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  required?: boolean;
  value?: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <FieldLabel label={label} required={required} />
      <TextField value={value ?? ''} onChange={e => onChange(e.target.value)} type={type} sx={inputSx} fullWidth />
    </Box>
  );
}

export default function ActiveRentalTenantPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const property = isNew ? null : properties.find(p => p.id === id);
  const tenant = tenants.find(t => t.id === property?.tenantId);
  const statusTags = isNew ? [{ date: '', label: 'New' }] : (property?.statusTags ?? []);

  const [form, setForm] = useState<Tenant | null>(tenant ?? null);
  const hasTenant = Boolean(form);

  const setTenant = <K extends keyof Tenant>(key: K, value: Tenant[K]) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const copyAddress = () => {
    if (!form?.domicileAddress) return;
    setTenant('mailingAddress', { ...form.domicileAddress });
  };
  const tenantForm = form as Tenant;

  if (!isNew && !property) {
    return (
      <Box sx={{ bgcolor: '#eef1f2', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(36,53,82,0.5)' }}>找不到物件資料</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#eef1f2', pb: 12 }}>
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasTenant && (
              <Box sx={{ px: 1.5, py: 0.25, bgcolor: '#f5c04f', borderRadius: '90px' }}>
                <Typography sx={{ fontSize: '12px', color: '#fff' }}>新承租人</Typography>
              </Box>
            )}
          </Box>
          {hasTenant && (
            <Button
              variant="contained"
              sx={{ bgcolor: '#31a0e8', borderRadius: '8px', fontSize: '12px', px: 2, minHeight: '34px', boxShadow: 'none' }}
            >
              更改承租人
            </Button>
          )}
        </Box>

        {!hasTenant ? (
          <Box
            sx={{
              minHeight: '600px',
              bgcolor: '#fafafa',
              borderRadius: '16px',
              boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography sx={{ fontSize: '16px', color: '#124a57' }}>此物件目前尚無承租人資料</Typography>
            <Button
              variant="contained"
              startIcon={<MdAdd size={16} />}
              sx={{ bgcolor: '#31a0e8', borderRadius: '8px', px: 2, minHeight: '45px', boxShadow: 'none' }}
              onClick={() => {
                setForm({
                  id: 'new',
                  name: '',
                  phone: '',
                  idNumber: '',
                  email: '',
                  familyMembers: [],
                  propertyHoldings: [],
                });
              }}
            >
              新增承租人
            </Button>
          </Box>
        ) : (
          <>
            <SectionCard title="承租人基本資料">
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: '357.5px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ImageUploadBox label="身分證正面" />
                  <ImageUploadBox label="身分證反面" />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ width: '92px' }}>
                      <FieldLabel label="性別" />
                      <Box sx={{ display: 'flex', border: '1px solid #31a0e8', borderRadius: '8px', overflow: 'hidden', height: '37px' }}>
                        {[
                          { key: 'male', label: '男' },
                          { key: 'female', label: '女' },
                        ].map((opt, i) => {
                          const active = tenantForm.gender === opt.key;
                          return (
                            <Box
                              key={opt.key}
                              onClick={() => setTenant('gender', opt.key as Tenant['gender'])}
                              sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: active ? '#66baf2' : '#fff',
                                color: active ? '#fff' : '#31a0e8',
                                fontSize: '12px',
                                borderLeft: i > 0 ? '1px solid #31a0e8' : 'none',
                              }}
                            >
                              {opt.label}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                    <TextInput label="姓名" required value={tenantForm.name} onChange={v => setTenant('name', v)} />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextInput label="身分證字號" required value={tenantForm.idNumber} onChange={v => setTenant('idNumber', v)} />
                    <TextInput label="出生日期" required type="date" value={tenantForm.dob} onChange={v => setTenant('dob', v)} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextInput label="市話(日)" required value={tenantForm.dayPhone} onChange={v => setTenant('dayPhone', v)} />
                    <TextInput label="市話(夜)" value={tenantForm.nightPhone} onChange={v => setTenant('nightPhone', v)} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextInput label="手機" value={tenantForm.phone} onChange={v => setTenant('phone', v)} />
                    <TextInput label="Email" value={tenantForm.email} onChange={v => setTenant('email', v)} />
                  </Box>
                  <AddressRow
                    value={tenantForm.domicileAddress}
                    onChange={v => setTenant('domicileAddress', v)}
                    required
                  />
                  <AddressRow
                    value={tenantForm.mailingAddress}
                    onChange={v => setTenant('mailingAddress', v)}
                    required
                    withSameButton
                    onCopy={copyAddress}
                  />
                </Box>
              </Box>
            </SectionCard>

            <SectionCard title="承租人匯款資料">
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: '357.5px', flexShrink: 0 }}>
                  <ImageUploadBox label="身分證反面" required />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextInput label="帳戶名稱" required value={tenantForm.bankAccountName} onChange={v => setTenant('bankAccountName', v)} />
                    <TextInput label="身分證字號" required value={tenantForm.bankIdNumber} onChange={v => setTenant('bankIdNumber', v)} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextInput label="金融機構" required value={tenantForm.bankCode} onChange={v => setTenant('bankCode', v)} />
                    <TextInput label="分行名稱" required value={tenantForm.bankBranchName} onChange={v => setTenant('bankBranchName', v)} />
                    <TextInput label="分行代碼" required value={tenantForm.bankBranchCode} onChange={v => setTenant('bankBranchCode', v)} />
                  </Box>
                  <TextInput label="帳戶號碼" required value={tenantForm.bankAccountNo} onChange={v => setTenant('bankAccountNo', v)} />
                </Box>
              </Box>
            </SectionCard>

            <SectionCard title="戶口名簿" green>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: '357.5px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ImageUploadBox label="申請人戶口名簿" required />
                  <ImageUploadBox label="配偶戶口名簿" />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextInput label="申請人戶口名稱" required value={tenantForm.applicantHouseholdName} onChange={v => setTenant('applicantHouseholdName', v)} />
                    <TextInput label="申請人戶號" required value={tenantForm.applicantRelation} onChange={v => setTenant('applicantRelation', v)} />
                    <TextInput label="配偶戶戶名號" value={tenantForm.spouseHouseholdNo} onChange={v => setTenant('spouseHouseholdNo', v)} />
                    <TextInput label="有育子女人數" value={String(tenantForm.childrenCount ?? '')} onChange={v => setTenant('childrenCount', Number(v || 0))} />
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<MdAdd size={14} />}
                    sx={{ width: '112px', bgcolor: '#81d394', borderRadius: '8px', minHeight: '37px', boxShadow: 'none', fontSize: '12px' }}
                  >
                    新增成員
                  </Button>

                  <Box sx={{ borderTop: '1px solid rgba(36,53,82,0.2)', borderBottom: '1px solid rgba(36,53,82,0.2)' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '100px 100px 120px 120px 1fr 127px', p: 1, gap: 1 }}>
                      {['姓名', '身分證字號', '出生年月日', '稱謂', '身分類別 (註)', '編輯'].map(h => <TinyText key={h}>{h}</TinyText>)}
                    </Box>
                    {(tenantForm.familyMembers ?? []).map(member => (
                      <Box key={member.id} sx={{ display: 'grid', gridTemplateColumns: '100px 100px 120px 120px 1fr 127px', p: 1, gap: 1, alignItems: 'center', borderTop: '1px solid rgba(36,53,82,0.12)' }}>
                        <TinyText>{member.name}</TinyText>
                        <TinyText>{member.idNumber}</TinyText>
                        <TinyText>{member.dob}</TinyText>
                        <TinyText>{member.relation}</TinyText>
                        <TinyText>{member.identityType}</TinyText>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton size="small"><MdEdit size={16} color="#81d394" /></IconButton>
                          <IconButton size="small"><MdDelete size={16} color="#81d394" /></IconButton>
                        </Box>
                      </Box>
                    ))}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '100px 100px 120px 120px 1fr 127px', p: 1, gap: 1, alignItems: 'center', borderTop: '1px solid rgba(36,53,82,0.12)' }}>
                      {['姓名', '身分證字號', '出生年月日', '稱謂', '選擇身分類別'].map((ph, i) => (
                        <TextField key={i} placeholder={ph} sx={inputSx} />
                      ))}
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton size="small"><MdSave size={16} color="#81d394" /></IconButton>
                        <IconButton size="small"><MdClose size={16} color="#81d394" /></IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SectionCard>

            <SectionCard title="承租人及家庭成員持有房產清單" green>
              <Button
                variant="contained"
                startIcon={<MdAdd size={14} />}
                sx={{ width: '84px', bgcolor: '#81d394', borderRadius: '8px', minHeight: '37px', boxShadow: 'none', fontSize: '12px', mb: 1 }}
              >
                新增
              </Button>
              <Box sx={{ borderTop: '1px solid rgba(36,53,82,0.2)', borderBottom: '1px solid rgba(36,53,82,0.2)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 60px 150px 100px 127px', p: 1, gap: 1 }}>
                  {['持有者', '房屋所在地址', '總面積 (平方公尺)', '持分比', '持分面積 (平方公尺)', '家人設籍於此', '編輯'].map(h => <TinyText key={h}>{h}</TinyText>)}
                </Box>
                {(tenantForm.propertyHoldings ?? []).map(item => (
                  <Box key={item.id} sx={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 60px 150px 100px 127px', p: 1, gap: 1, alignItems: 'center', borderTop: '1px solid rgba(36,53,82,0.12)' }}>
                    <TinyText>{item.holder}</TinyText>
                    <TinyText>{item.address}</TinyText>
                    <TinyText>{item.totalArea}</TinyText>
                    <TinyText>{item.shareRatio}</TinyText>
                    <TinyText>{item.shareArea}</TinyText>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {item.familyRegistered ? <MdOutlineCheck size={16} color="#124a57" /> : null}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton size="small"><MdEdit size={16} color="#81d394" /></IconButton>
                      <IconButton size="small"><MdDelete size={16} color="#81d394" /></IconButton>
                    </Box>
                  </Box>
                ))}
                <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 60px 150px 100px 127px', p: 1, gap: 1, alignItems: 'center', borderTop: '1px solid rgba(36,53,82,0.12)' }}>
                  <TextField placeholder="姓名" sx={inputSx} />
                  <TextField placeholder="地址" sx={inputSx} />
                  <TextField placeholder="總面積" sx={inputSx} />
                  <TextField placeholder="/" sx={inputSx} />
                  <TextField placeholder="持分面積" sx={inputSx} />
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <IconButton size="small"><MdSave size={16} color="#81d394" /></IconButton>
                    <IconButton size="small"><MdClose size={16} color="#81d394" /></IconButton>
                  </Box>
                </Box>
              </Box>
            </SectionCard>
          </>
        )}

        </Box>{/* end sections */}
      </Box>
    </Box>
  );
}
