import { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import {
  MdTask,
  MdRequestQuote,
  MdDescription,
  MdInsertDriveFile,
} from 'react-icons/md';

// ─── 常數 ────────────────────────────────────────────────────────────────────

export const CATEGORY_ORDER = ['申請書', '費用補助', '契約', '其他'] as const;

export const ICON_STYLE: Record<string, { color: string; bg: string }> = {
  task:        { color: '#e65100', bg: '#fff3e0' },
  quote:       { color: '#c62828', bg: '#ffebee' },
  description: { color: '#1565c0', bg: '#e3f2fd' },
  file:        { color: '#37474f', bg: '#eceff1' },
};

export const REPAIR_ITEMS_4 = ['大門', '門鎖', '門鈴', '對講機', '房門'];
export const REPAIR_ITEMS_5 = ['落地門窗', '紗門', '玻璃窗', '天花板', '房門'];
export const REPAIR_ITEMS_6 = ['洗臉台', '流理台', '排水孔', '水龍頭', '馬桶'];
export const CONTRACT_DIALOG_HEIGHT = 740;
export const CONTRACT_DIALOG_MAX_HEIGHT = 'calc(100vh - 64px)';

// ─── 樣式常數 ──────────────────────────────────────────────────────────────────

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '8px',
    fontSize: '14px',
    bgcolor: '#ffffff',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
    '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#81d394' },
  },
};

export const selectSx = {
  height: '40px',
  borderRadius: '8px',
  fontSize: '14px',
  bgcolor: '#ffffff',
  '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
  '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.4)' },
  '&.Mui-focused fieldset': { borderColor: '#81d394' },
};

export const checkboxSx = {
  color: 'rgba(36,53,82,0.35)',
  '&.Mui-checked': { color: '#81d394' },
  padding: '4px',
};

export const radioSx = {
  color: 'rgba(36,53,82,0.35)',
  '&.Mui-checked': { color: '#81d394' },
  padding: '4px',
};

export const greenBtnSx = {
  bgcolor: '#81d394',
  color: '#fff',
  borderRadius: '8px',
  height: 37,
  px: 2,
  '&:hover': { bgcolor: '#6bc480' },
};

export const outlineBtnSx = {
  borderRadius: '8px',
  height: 37,
  color: '#81d394',
  borderColor: '#81d394',
};

// ─── 共用元件 ──────────────────────────────────────────────────────────────────

export function DocIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const style = ICON_STYLE[icon] ?? ICON_STYLE.file;
  const IconComp =
    icon === 'task'        ? MdTask :
    icon === 'quote'       ? MdRequestQuote :
    icon === 'description' ? MdDescription :
    MdInsertDriveFile;
  return (
    <Box sx={{
      width: 28, height: 28,
      borderRadius: '6px',
      // bgcolor: style.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <IconComp size={size} color={style.color} />
    </Box>
  );
}

export function StepIndicator({
  total,
  current,
  onStepClick,
}: {
  total: number;
  current: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, mb: 3 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Box
            onClick={() => onStepClick?.(i + 1)}
            sx={{
              width: 32, height: 32, borderRadius: '50%',
              bgcolor: i + 1 === current ? '#81d394' : '#f0f0f0',
              boxShadow: i + 1 === current ? '1px 1px 4px 0px rgba(0,0,0,0.4)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 400,
              color: i + 1 === current ? '#fff' : 'rgba(36,53,82,0.35)',
              cursor: onStepClick ? 'pointer' : 'default',
              flexShrink: 0,
            }}
          >
            {i + 1}
          </Box>
          {i < total - 1 && (
            <Box
              sx={{
                width: 20,
                height: 0,
                borderTop: '1px solid rgba(36,53,82,0.35)',
                mx: 0.5,
                flexShrink: 0,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

export function SectionCard({
  title,
  children,
  sx,
}: {
  title: string;
  children: React.ReactNode;
  sx?: Record<string, unknown>;
}) {
  return (
    <Box sx={{
      border: '1px solid rgba(36,53,82,0.2)',
      borderRadius: '10px',
      p: 3,
      bgcolor: '#ffffff',
      mb: 2,
      overflowY: 'auto',
      minHeight: 0,
      ...sx,
    }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#124a57', mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function CostRow({
  label,
  value,
  onChange,
  amountLabel,
  extra,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  amountLabel: string;
  extra?: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)', mb: 0.5 }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
          <FormControlLabel value="包租業負擔" control={<Radio sx={radioSx} size="small" />} label="包租業負擔" />
          <FormControlLabel value="承租人負擔" control={<Radio sx={radioSx} size="small" />} label="承租人負擔" />
        </RadioGroup>
        {extra}
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
          <Typography sx={{ fontSize: '12px', color: 'rgba(36,53,82,0.6)', mb: 0.3 }}>{amountLabel}</Typography>
          <TextField size="small" sx={inputSx} />
        </Box>
      </Box>
    </Box>
  );
}

export function RepairTable({ items }: { items: string[] }) {
  return (
    <Table size="small">
      <TableBody>
        {items.map(name => <RepairRow key={name} name={name} />)}
      </TableBody>
    </Table>
  );
}

function RepairRow({ name }: { name: string }) {
  const [deliver, setDeliver] = useState('現狀');
  const [resp, setResp] = useState('有');
  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 500, color: '#124a57', width: 80 }}>{name}</TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'rgba(36,53,82,0.5)', mb: 0.3 }}>點交狀況</Typography>
          <RadioGroup row value={deliver} onChange={(e) => setDeliver(e.target.value)}>
            <FormControlLabel value="現狀" control={<Radio sx={radioSx} size="small" />} label="現狀" />
            <FormControlLabel value="修繕後點交" control={<Radio sx={radioSx} size="small" />} label="修繕後點交" />
          </RadioGroup>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'rgba(36,53,82,0.5)', mb: 0.3 }}>租賃期間修繕責任</Typography>
          <RadioGroup row value={resp} onChange={(e) => setResp(e.target.value)}>
            <FormControlLabel value="有" control={<Radio sx={radioSx} size="small" />} label="有" />
            <FormControlLabel value="無" control={<Radio sx={radioSx} size="small" />} label="無" />
          </RadioGroup>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'rgba(36,53,82,0.5)', mb: 0.3 }}>備註</Typography>
          <TextField size="small" sx={{ ...inputSx, minWidth: 120 }} />
        </Box>
      </TableCell>
    </TableRow>
  );
}
