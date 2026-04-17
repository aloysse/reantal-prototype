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
import { MdClose, MdArrowRightAlt, MdInfoOutline } from 'react-icons/md';
import {
  StepIndicator,
  SectionCard,
  CostRow,
  RepairTable,
  inputSx,
  selectSx,
  checkboxSx,
  radioSx,
  greenBtnSx,
  outlineBtnSx,
  REPAIR_ITEMS_4,
  REPAIR_ITEMS_5,
  REPAIR_ITEMS_6,
} from './contractDialogUtils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SubLeaseContractDialog({ open, onClose }: Props) {
  const [step, setStep] = useState(1);

  // Step 1
  const [signDate,       setSignDate]       = useState('');
  const [reviewDate,     setReviewDate]     = useState('');
  const [reviewDays,     setReviewDays]     = useState('3');
  const [rentStart,      setRentStart]      = useState('');
  const [rentEnd,        setRentEnd]        = useState('');
  const [earlyTerminate, setEarlyTerminate] = useState('無');
  const [earlyNote,      setEarlyNote]      = useState('');
  const [monthRent,      setMonthRent]      = useState('24,000');
  const [payDay,         setPayDay]         = useState('');
  const [payMethod,      setPayMethod]      = useState('');
  const [payOther,       setPayOther]       = useState('');

  // Step 2
  const [waterBy,       setWaterBy]       = useState('');
  const [electricBy,    setElectricBy]    = useState('');
  const [electricMethod,setElectricMethod] = useState('用電度數');
  const [gasBy,         setGasBy]         = useState('');
  const [mgmtBy,        setMgmtBy]        = useState('');
  const [parkBy,        setParkBy]        = useState('');

  // Step 3
  const [notaryFee,       setNotaryFee]       = useState('包租業負擔');
  const [renovation,      setRenovation]      = useState('負責回復原狀');
  const [renovationOther, setRenovationOther] = useState('');
  const [expirePolicy,    setExpirePolicy]    = useState('不得終止租約');
  const [hasOtherDoc,     setHasOtherDoc]     = useState(false);
  const [otherDoc,        setOtherDoc]        = useState('');

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '22px', fontWeight: 600, color: '#124a57' }}>
            社會住宅-轉租契約書
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <MdClose size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <StepIndicator total={6} current={step} />

        {/* ── Step 1：基本資訊 ─────────────────────────────────────────── */}
        {step === 1 && (
          <SectionCard title="基本資訊">
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  契約簽訂日 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField value={signDate} onChange={e => setSignDate(e.target.value)}
                  placeholder="YYYY-MM-DD" sx={{ ...inputSx, width: '100%' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  契約審閱日 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField value={reviewDate} onChange={e => setReviewDate(e.target.value)}
                  placeholder="YYYY-MM-DD" sx={{ ...inputSx, width: '100%' }} />
              </Box>
              <Box sx={{ width: 160 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  審閱天數 (最少3天) <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField value={reviewDays} onChange={e => setReviewDays(e.target.value)}
                  sx={{ ...inputSx, width: '100%' }} />
              </Box>
            </Box>

            <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
              租賃期間 <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField value={rentStart} onChange={e => setRentStart(e.target.value)}
                placeholder="YYYY-MM-DD" sx={{ ...inputSx, flex: 1 }} />
              <MdArrowRightAlt size={20} color="rgba(36,53,82,0.5)" />
              <TextField value={rentEnd} onChange={e => setRentEnd(e.target.value)}
                placeholder="YYYY-MM-DD" sx={{ ...inputSx, flex: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
              <Box>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  有無提前終止租約之約定 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Box sx={{ display: 'flex', border: '1px solid #81d394', borderRadius: '8px', overflow: 'hidden' }}>
                  {['有', '無'].map((opt, i) => (
                    <Box key={opt} component="button" onClick={() => setEarlyTerminate(opt)} sx={{
                      height: 37, px: 2.5, fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                      bgcolor: earlyTerminate === opt ? '#81d394' : 'transparent',
                      color:   earlyTerminate === opt ? '#fff'    : '#81d394',
                      borderLeft: i > 0 ? '1px solid #81d394' : 'none',
                      border: 'none', outline: 'none',
                    }}>
                      {opt}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  提前終止之備註 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Select value={earlyNote} onChange={e => setEarlyNote(e.target.value)}
                  displayEmpty sx={{ ...selectSx, width: '100%' }}>
                  <MenuItem value=""><em>請選擇</em></MenuItem>
                  <MenuItem value="協議終止">協議終止</MenuItem>
                  <MenuItem value="違約終止">違約終止</MenuItem>
                </Select>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)' }}>
                    每月租金 <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <MdInfoOutline size={14} color="#31a0e8" />
                  <Typography sx={{ fontSize: '12px', color: '#31a0e8' }}>同步於物件資料</Typography>
                </Box>
                <TextField value={monthRent} onChange={e => setMonthRent(e.target.value)}
                  sx={{ ...inputSx, width: '100%' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                  每月支付日 <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField value={payDay} onChange={e => setPayDay(e.target.value)}
                  placeholder="日" sx={{ ...inputSx, width: '100%' }} />
              </Box>
            </Box>

            <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
              租金支付方式 <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <RadioGroup row value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                {['轉帳繳付', '票據繳付', '現金繳付', '其他'].map(opt => (
                  <FormControlLabel key={opt} value={opt}
                    control={<Radio sx={radioSx} size="small" />} label={opt} />
                ))}
              </RadioGroup>
              {payMethod === '其他' && (
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                    其他方式 <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Select value={payOther} onChange={e => setPayOther(e.target.value)}
                    displayEmpty sx={{ ...selectSx, width: '100%' }}>
                    <MenuItem value=""><em>請選擇</em></MenuItem>
                    <MenuItem value="票據">票據</MenuItem>
                    <MenuItem value="其他">其他</MenuItem>
                  </Select>
                </Box>
              )}
            </Box>
          </SectionCard>
        )}

        {/* ── Step 2：相關費用支付 ─────────────────────────────────────── */}
        {step === 2 && (
          <SectionCard title="相關費用支付">
            <CostRow label="水費" value={waterBy} onChange={setWaterBy} amountLabel="每度水費" />
            <CostRow
              label="電費"
              value={electricBy}
              onChange={setElectricBy}
              amountLabel="每期每度"
              extra={electricBy === '承租人負擔' ? (
                <Box sx={{ display: 'flex', border: '1px solid #81d394', borderRadius: '8px', overflow: 'hidden' }}>
                  {['用電度數', '非用電度數'].map((opt, i) => (
                    <Box key={opt} component="button" onClick={() => setElectricMethod(opt)} sx={{
                      height: 37, px: 1.5, fontSize: '13px', cursor: 'pointer',
                      bgcolor: electricMethod === opt ? '#81d394' : 'transparent',
                      color:   electricMethod === opt ? '#fff'    : '#81d394',
                      borderLeft: i > 0 ? '1px solid #81d394' : 'none',
                      border: 'none', outline: 'none',
                    }}>{opt}</Box>
                  ))}
                </Box>
              ) : undefined}
            />
            <CostRow label="瓦斯費"       value={gasBy}   onChange={setGasBy}   amountLabel="其他" />
            <CostRow label="管理費"       value={mgmtBy}  onChange={setMgmtBy}  amountLabel="每月管理費" />
            <CostRow label="停車位管理費" value={parkBy}  onChange={setParkBy}  amountLabel="每月停車管理費" />
          </SectionCard>
        )}

        {/* ── Step 3：稅費負擔之約定 + 其他 ──────────────────────────── */}
        {step === 3 && (
          <>
            <SectionCard title="稅費負擔之約定">
              <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>公證費</Typography>
              <RadioGroup row value={notaryFee} onChange={e => setNotaryFee(e.target.value)}>
                <FormControlLabel value="包租業負擔" control={<Radio sx={radioSx} size="small" />} label="包租業負擔" />
                <FormControlLabel value="承租人負擔" control={<Radio sx={radioSx} size="small" />} label="承租人負擔" />
                <FormControlLabel value="平均分擔"  control={<Radio sx={radioSx} size="small" />} label="平均分擔" />
              </RadioGroup>
            </SectionCard>

            <SectionCard title="其他">
              <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                室內裝修於返還租賃住宅時
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2 }}>
                <RadioGroup row value={renovation} onChange={e => setRenovation(e.target.value)}>
                  <FormControlLabel value="負責回復原狀" control={<Radio sx={radioSx} size="small" />} label="負責回復原狀" />
                  <FormControlLabel value="現況返還"    control={<Radio sx={radioSx} size="small" />} label="現況返還" />
                  <FormControlLabel value="其他"        control={<Radio sx={radioSx} size="small" />} label="其他" />
                </RadioGroup>
                {renovation === '其他' && (
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                      其他 <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField value={renovationOther} onChange={e => setRenovationOther(e.target.value)}
                      sx={{ ...inputSx, width: '100%' }} />
                  </Box>
                )}
              </Box>

              <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                契約期限屆滿前，租賃雙方
              </Typography>
              <RadioGroup row value={expirePolicy} onChange={e => setExpirePolicy(e.target.value)} sx={{ mb: 2 }}>
                <FormControlLabel value="得終止租約"  control={<Radio sx={radioSx} size="small" />} label="得終止租約" />
                <FormControlLabel value="不得終止租約" control={<Radio sx={radioSx} size="small" />} label="不得終止租約" />
              </RadioGroup>

              <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>是否附其他文件</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <FormControlLabel
                  control={
                    <Checkbox checked={hasOtherDoc} onChange={e => setHasOtherDoc(e.target.checked)}
                      sx={checkboxSx} size="small" />
                  }
                  label="是"
                />
                {hasOtherDoc && (
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>
                      其他文件 <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField value={otherDoc} onChange={e => setOtherDoc(e.target.value)}
                      sx={{ ...inputSx, width: '100%' }} />
                  </Box>
                )}
              </Box>
            </SectionCard>
          </>
        )}

        {/* ── Step 4：修繕項目 - 室外 ─────────────────────────────────── */}
        {step === 4 && (
          <SectionCard title="包租業負責修繕項目 - 室外">
            <RepairTable items={REPAIR_ITEMS_4} />
          </SectionCard>
        )}

        {/* ── Step 5：修繕項目 - 客餐廳及臥室 ────────────────────────── */}
        {step === 5 && (
          <SectionCard title="包租業負責修繕項目 - 客餐廳及臥室">
            <RepairTable items={REPAIR_ITEMS_5} />
          </SectionCard>
        )}

        {/* ── Step 6：修繕項目 - 廚房及衛浴設備等 ────────────────────── */}
        {step === 6 && (
          <SectionCard title="包租業負責修繕項目 - 廚房及衛浴設備等">
            <RepairTable items={REPAIR_ITEMS_6} />
          </SectionCard>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        {step > 1 ? (
          <Button variant="outlined" onClick={() => setStep(s => s - 1)} sx={outlineBtnSx}>
            上一步
          </Button>
        ) : <Box />}
        {step < 6 ? (
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
