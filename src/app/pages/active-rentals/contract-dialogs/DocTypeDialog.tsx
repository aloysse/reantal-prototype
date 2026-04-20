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
} from '@mui/material';
import { MdClose } from 'react-icons/md';
import { documentTypes } from '../../../data/mockData';
import { CATEGORY_ORDER, CONTRACT_DIALOG_HEIGHT, CONTRACT_DIALOG_MAX_HEIGHT, DocIcon, greenBtnSx } from './contractDialogUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  usedTypeIds: string[];
  onSelect: (typeId: string) => void;
}

export default function DocTypeDialog({ open, onClose, usedTypeIds, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleBuild = () => {
    if (!selected) return;
    if (selected === 'dt2' || selected === 'dt8') {
      onSelect(selected);
    }
    // 其他選項無動作
  };

  const usedTypes   = documentTypes.filter(dt =>  usedTypeIds.includes(dt.id));
  const unusedTypes = documentTypes.filter(dt => !usedTypeIds.includes(dt.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px', p: 1, height: `${CONTRACT_DIALOG_HEIGHT}px`, maxHeight: CONTRACT_DIALOG_MAX_HEIGHT } } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#124a57' }}>
            選擇文件類型
          </Typography>
          <IconButton onClick={onClose} size="small">
            <MdClose size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {CATEGORY_ORDER.map((cat) => {
            const items = unusedTypes.filter(dt => dt.category === cat);
            if (items.length === 0) return null;
            return (
              <Box key={cat}>
                <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#124a57', mb: 2 }}>
                  {cat}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {items.map(dt => (
                    <Box
                      key={dt.id}
                      onClick={() => setSelected(dt.id)}
                      sx={{
                        border: `1px solid ${selected === dt.id ? '#81d394' : 'rgba(36,53,82,0.35)'}`,
                        borderRadius: '10px',
                        px: 2, py: 1.5,
                        display: 'flex', alignItems: 'center', gap: 1,
                        cursor: 'pointer',
                        bgcolor: selected === dt.id ? '#f1faf4' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <DocIcon icon={dt.icon} />
                      <Typography sx={{ flex: 1, fontSize: '16px', color: '#124a57' }}>
                        {dt.name}
                      </Typography>
                      <Radio
                        checked={selected === dt.id}
                        onChange={() => setSelected(dt.id)}
                        color="success"
                        size="small"
                        sx={{ p: '4px' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}

          {usedTypes.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '18px', fontWeight: 500, color: 'rgba(36,53,82,0.35)', mb: 2 }}>
                已使用
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {usedTypes.map(dt => (
                  <Box
                    key={dt.id}
                    sx={{
                      border: '1px solid rgba(36,53,82,0.35)',
                      borderRadius: '10px',
                      px: 2, py: 1.5,
                      display: 'flex', alignItems: 'center', gap: 1,
                      opacity: 0.5,
                    }}
                  >
                    <DocIcon icon={dt.icon} />
                    <Typography sx={{ flex: 1, fontSize: '16px', color: 'rgba(36,53,82,0.35)' }}>
                      {dt.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleBuild} sx={{ ...greenBtnSx, boxShadow: '0px 1px 5px rgba(0,0,0,0.12)' }}>
          建立文件
        </Button>
      </DialogActions>
    </Dialog>
  );
}
