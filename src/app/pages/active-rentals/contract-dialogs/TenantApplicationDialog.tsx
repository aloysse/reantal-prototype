import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { MdClose } from 'react-icons/md';
import {
  StepIndicator,
  SectionCard,
  inputSx,
  selectSx,
  checkboxSx,
  radioSx,
  greenBtnSx,
  outlineBtnSx,
  CONTRACT_DIALOG_HEIGHT,
  CONTRACT_DIALOG_MAX_HEIGHT,
} from './contractDialogUtils';

const ATTACH_SECTIONS = [
  {
    label: '身份證明文件',
    items: ['身分證正反面影本', '戶口名簿'],
  },
  {
    label: '財稅相關文件',
    items: ['全國財產總歸戶查詢清單', '綜合所得稅各類所得資料清單', '存摺影本'],
  },
  {
    label: '申請資格證明文件',
    items: ['弱勢戶資格證明文件', '警消人員在職證明文件', '身心障礙者、65歲以上老人換居方案申請書'],
  },
  {
    label: '其他文件',
    items: ['個資同意書', '放客放棄補貼及社宅切結書', '租金補貼核定影本'],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TenantApplicationDialog({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [landlordNote, setLandlordNote] = useState('');
  const [housingPolicy, setHousingPolicy] = useState('以上均無');
  const [youthProgram, setYouthProgram] = useState('以上均無');
  const [marriageDate, setMarriageDate] = useState('');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (key: string) =>
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px', p: 1, height: `${CONTRACT_DIALOG_HEIGHT}px`, maxHeight: CONTRACT_DIALOG_MAX_HEIGHT } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '22px', fontWeight: 600, color: '#124a57' }}>
            民眾(房客)承租物件申請書
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <MdClose size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 540 }}>
        <StepIndicator total={2} current={step} onStepClick={setStep} />

        {/* Step 1：基本資訊 */}
        {step === 1 && (
          <SectionCard title="基本資訊" sx={{ flex: 1, mb: 0 }}>
            <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
              出租人註記
            </Typography>
            <RadioGroup row value={landlordNote} onChange={(e) => setLandlordNote(e.target.value)} sx={{ mb: 2 }}>
              <FormControlLabel value="長者換居"  control={<Radio sx={radioSx} size="small" />} label="長者換居" />
              <FormControlLabel value="身障換居"  control={<Radio sx={radioSx} size="small" />} label="身障換居" />
              <FormControlLabel value="共住者註記" control={<Radio sx={radioSx} size="small" />} label="共住者註記" />
            </RadioGroup>

            <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
              現有住宅政策補助 <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Select
              value={housingPolicy}
              onChange={(e) => setHousingPolicy(e.target.value)}
              sx={{ ...selectSx, width: '100%', mb: 2 }}
            >
              <MenuItem value="以上均無">以上均無</MenuItem>
              <MenuItem value="租金補貼">租金補貼</MenuItem>
              <MenuItem value="購屋補貼">購屋補貼</MenuItem>
              <MenuItem value="修繕補貼">修繕補貼</MenuItem>
            </Select>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  青年婚育租屋專案 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Select
                  value={youthProgram}
                  onChange={(e) => setYouthProgram(e.target.value)}
                  sx={{ ...selectSx, width: '100%' }}
                >
                  <MenuItem value="以上均無">以上均無</MenuItem>
                  <MenuItem value="結婚">結婚</MenuItem>
                  <MenuItem value="生育">生育</MenuItem>
                  <MenuItem value="育兒">育兒</MenuItem>
                </Select>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  結婚日期 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  value={marriageDate}
                  onChange={(e) => setMarriageDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  sx={{ ...inputSx, width: '100%' }}
                />
              </Box>
            </Box>
          </SectionCard>
        )}

        {/* Step 2：檢附文件檢核 */}
        {step === 2 && (
          <SectionCard title="檢附文件檢核" sx={{ flex: 1, mb: 0 }}>
            {ATTACH_SECTIONS.map(section => (
              <Box key={section.label} sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  {section.label}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {section.items.map(item => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={!!checkedDocs[item]}
                          onChange={() => toggleDoc(item)}
                          sx={checkboxSx}
                          size="small"
                        />
                      }
                      label={item}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </SectionCard>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        {step > 1 ? (
          <Button variant="outlined" onClick={() => setStep(s => s - 1)} sx={outlineBtnSx}>
            上一步
          </Button>
        ) : <Box />}
        {step < 2 ? (
          <Button onClick={() => setStep(s => s + 1)} sx={greenBtnSx}>
            下一步
          </Button>
        ) : (
          <Button onClick={handleClose} sx={greenBtnSx}>
            建立文件
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
