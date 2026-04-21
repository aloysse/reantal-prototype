import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Radio,
} from '@mui/material';
import { MdClose, MdArrowForward, MdArrowBack, MdCheckCircle, MdTask } from 'react-icons/md';

type RentalType = 'general' | 'social';
type SocialType = 'baozhu' | 'daizu';
type Step = 'rental-type' | 'social-type' | 'social-period';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    rentalType: RentalType;
    socialType?: SocialType;
    period?: string;
  }) => void;
}

const socialPeriods = [
  { id: 'p5', label: '第五期 1150225' },
  { id: 'p4-inc', label: '第四期 (增) 1150225' },
  { id: 'p4', label: '第四期 1150202' },
];

// Shared toggle button group style
function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        border: '1px solid #31a0e8',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <Box
            key={opt.value}
            onClick={() => onChange(opt.value)}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
              py: '10px',
              bgcolor: selected ? '#66baf2' : '#ffffff',
              cursor: 'pointer',
              borderLeft: i > 0 ? '1px solid #31a0e8' : 'none',
              transition: 'background-color 0.15s',
              '&:hover': {
                bgcolor: selected ? '#66baf2' : 'rgba(49,160,232,0.06)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: selected ? '#ffffff' : '#31a0e8',
                lineHeight: '24.5px',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {opt.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function AddRentalModal({ open, onClose, onCreate }: Props) {
  const [step, setStep] = useState<Step>('rental-type');
  const [rentalType, setRentalType] = useState<RentalType>('social');
  const [socialType, setSocialType] = useState<SocialType>('baozhu');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('p5');

  const handleClose = () => {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setStep('rental-type');
      setRentalType('social');
      setSocialType('baozhu');
      setSelectedPeriod('p5');
    }, 300);
  };

  const titleMap: Record<Step, string> = {
    'rental-type': '選擇租案類型',
    'social-type': '選擇社宅類型',
    'social-period': '選擇社宅期數',
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            p: 4,
            width: 560,
            borderRadius: '16px',
            boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
            overflow: 'visible',
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 2 }}>
            <Typography
              sx={{
                fontSize: '24px',
                fontWeight: 500,
                color: '#124a57',
                lineHeight: 1.167,
              }}
            >
              {titleMap[step]}
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: 'rgba(36,53,82,0.5)',
                mt: '-4px',
                mr: '-8px',
                '&:hover': { color: '#124a57', bgcolor: 'rgba(36,53,82,0.06)' },
              }}
            >
              <MdClose size={20} />
            </IconButton>
          </Box>

          {/* Step 1: 選擇租案類型 */}
          {step === 'rental-type' && (
            <>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                }}
              >
                <ToggleGroup
                  options={[
                    { value: 'general' as RentalType, label: '一般租賃' },
                    { value: 'social' as RentalType, label: '社會住宅' },
                  ]}
                  value={rentalType}
                  onChange={setRentalType}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                {rentalType === 'general' ? (
                  <Button
                    variant="contained"
                    startIcon={<MdCheckCircle size={16} />}
                    onClick={() => {
                      onCreate({ rentalType: 'general' });
                      handleClose();
                    }}
                    sx={primaryBtnSx}
                  >
                    新增
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<MdArrowForward size={16} />}
                    onClick={() => setStep('social-type')}
                    sx={primaryBtnSx}
                  >
                    選擇類型
                  </Button>
                )}
              </Box>
            </>
          )}

          {/* Step 2: 選擇社宅類型 */}
          {step === 'social-type' && (
            <>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                }}
              >
                <ToggleGroup
                  options={[
                    { value: 'baozhu' as SocialType, label: '包租' },
                    { value: 'daizu' as SocialType, label: '代租代管' },
                  ]}
                  value={socialType}
                  onChange={setSocialType}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<MdArrowBack size={16} />}
                  onClick={() => setStep('rental-type')}
                  sx={outlinedBtnSx}
                >
                  上一步
                </Button>
                <Button
                  variant="contained"
                  endIcon={<MdArrowForward size={16} />}
                  onClick={() => setStep('social-period')}
                  sx={primaryBtnSx}
                >
                  選擇期數
                </Button>
              </Box>
            </>
          )}

          {/* Step 3: 選擇社宅期數 */}
          {step === 'social-period' && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  py: 2,
                }}
              >
                {socialPeriods.map((period) => (
                  <Box
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 2,
                      border: '1px solid',
                      borderColor:
                        selectedPeriod === period.id
                          ? '#31a0e8'
                          : 'rgba(36,53,82,0.35)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      bgcolor: selectedPeriod === period.id ? 'rgba(49,160,232,0.04)' : '#ffffff',
                      transition: 'border-color 0.15s, background-color 0.15s',
                      '&:hover': {
                        borderColor: '#31a0e8',
                        bgcolor: 'rgba(49,160,232,0.04)',
                      },
                    }}
                  >
                    {/* Document icon */}
                    <Box sx={{ color: '#5bb971', flexShrink: 0 }}>
                      <MdTask size={24} />
                    </Box>
                    {/* Label */}
                    <Typography
                      sx={{
                        flex: 1,
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#124a57',
                        lineHeight: '24px',
                      }}
                    >
                      {period.label}
                    </Typography>
                    {/* Radio */}
                    <Radio
                      checked={selectedPeriod === period.id}
                      onChange={() => setSelectedPeriod(period.id)}
                      color="primary"
                      size="small"
                      sx={{ p: '4px' }}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<MdArrowBack size={16} />}
                  onClick={() => setStep('social-type')}
                  sx={outlinedBtnSx}
                >
                  上一步
                </Button>
                <Button
                  variant="contained"
                  startIcon={<MdCheckCircle size={16} />}
                  onClick={() => {
                    onCreate({
                      rentalType: 'social',
                      socialType,
                      period: selectedPeriod,
                    });
                    handleClose();
                  }}
                  sx={primaryBtnSx}
                >
                  新增
                </Button>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Shared button styles
const primaryBtnSx = {
  bgcolor: '#31a0e8',
  color: '#ffffff',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  height: '37px',
  textTransform: 'none',
  boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
  '&:hover': { bgcolor: '#2090d8', boxShadow: '0px 2px 6px rgba(0,0,0,0.18)' },
} as const;

const outlinedBtnSx = {
  color: '#31a0e8',
  borderColor: '#31a0e8',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  height: '37px',
  textTransform: 'none',
  '&:hover': { borderColor: '#2090d8', bgcolor: 'rgba(49,160,232,0.06)' },
} as const;
