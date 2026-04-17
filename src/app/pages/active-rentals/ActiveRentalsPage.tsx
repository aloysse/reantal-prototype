import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { MdAdd, MdSearch, MdMoreVert } from 'react-icons/md';
import { properties } from '../../data/mockData';
import type { Property } from '../../data/mockData';
import AddRentalModal from '../../components/AddRentalModal';

const activeProperties = properties.filter((p) => p.listingType === 'active');

function TypeChip({ type }: { type: Property['type'] }) {
  const isSocial = type === 'social';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: isSocial ? '#8dde85' : '#23c880',
        borderRadius: '90px',
        px: 0.75,
        py: 0,
        minHeight: '24px',
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 400,
          color: '#ffffff',
          lineHeight: '12px',
          px: 0.75,
          whiteSpace: 'nowrap',
        }}
      >
        {isSocial ? '社會住宅' : '一般租賃'}
      </Typography>
    </Box>
  );
}

function StatusChip({ status }: { status: Property['socialApplicationStatus'] }) {
  if (!status) return null;

  const isApproved = status === 'approved';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: isApproved ? '#4d584c' : 'rgba(77,88,76,0.35)',
        borderRadius: '90px',
        px: 0.75,
        py: 0,
        minHeight: '24px',
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 400,
          color: '#ffffff',
          lineHeight: '12px',
          px: 0.75,
          whiteSpace: 'nowrap',
        }}
      >
        {isApproved ? '已通過' : '申請中'}
      </Typography>
    </Box>
  );
}

const ROWS_PER_PAGE = 10;

const headerCols = [
  { label: '類型', width: 80 },
  { label: '社宅申請狀態', width: 100 },
  { label: '社宅物件編號', width: 200 },
  { label: '物件名稱', flex: true },
  { label: '門牌地址', width: 200 },
  { label: '租金', width: 110 },
  { label: '坪數', width: 60 },
  { label: '樓層', width: 90 },
  { label: '格局', width: 80 },
  { label: '建物型態', width: 80 },
];

export default function ActiveRentalsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateRental = (payload: {
    rentalType: 'general' | 'social';
    socialType?: 'baozhu' | 'daizu';
    period?: string;
  }) => {
    if (payload.rentalType === 'general') {
      navigate('/active-rentals/new?type=general');
      return;
    }

    const params = new URLSearchParams({
      type: 'social',
      socialType: payload.socialType ?? 'baozhu',
      period: payload.period ?? 'p5',
    });
    navigate(`/active-rentals/new?${params.toString()}`);
  };

  const totalPages = Math.ceil(activeProperties.length / ROWS_PER_PAGE);
  const paginatedItems = activeProperties.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 56px)',
        bgcolor: '#eef1f2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        py: 4,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1584px',
        }}
      >
        {/* Card */}
        <Box
          sx={{
            bgcolor: '#fafafa',
            borderRadius: '16px',
            boxShadow: '1px 3px 7px 0px rgba(17,28,45,0.18)',
            p: 4,
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Top bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Add button */}
            <Button
              variant="contained"
              startIcon={<MdAdd size={16} />}
              onClick={() => setModalOpen(true)}
              sx={{
                bgcolor: '#31a0e8',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                height: '37px',
                boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: '#2090d8' },
                textTransform: 'none',
              }}
            >
              新增物件
            </Button>

            {/* Search */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                placeholder="關鍵字搜尋"
                size="small"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{
                  width: 257,
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    fontSize: '14px',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <MdSearch size={18} color="rgba(0,0,0,0.38)" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#31a0e8',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 2,
                  height: '37px',
                  minWidth: 'auto',
                  boxShadow: '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14)',
                  '&:hover': { bgcolor: '#2090d8' },
                  textTransform: 'none',
                }}
              >
                搜尋
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Header row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                px: '6px',
                py: '6px',
                borderBottom: '1px solid rgba(36,53,82,0.35)',
                minHeight: '37px',
              }}
            >
              {headerCols.map((col) => (
                <Typography
                  key={col.label}
                  sx={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(36,53,82,0.35)',
                    lineHeight: '16px',
                    width: col.flex ? undefined : col.width,
                    flex: col.flex ? 1 : undefined,
                    minWidth: col.flex ? 0 : undefined,
                    flexShrink: col.flex ? 1 : 0,
                  }}
                >
                  {col.label}
                </Typography>
              ))}
              {/* action col placeholder */}
              <Box sx={{ width: 40, flexShrink: 0 }} />
            </Box>

            {/* Data rows */}
            {paginatedItems.map((item) => (
              <Box
                key={item.id}
                onClick={() => navigate('/active-rentals/' + item.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  px: '6px',
                  py: '12px',
                  borderBottom: '1px solid rgba(36,53,82,0.2)',
                  '&:hover': { bgcolor: 'rgba(49,160,232,0.04)' },
                  cursor: 'pointer',
                }}
              >
                {/* 類型 */}
                <Box sx={{ width: 80, flexShrink: 0 }}>
                  <TypeChip type={item.type} />
                </Box>

                {/* 社宅申請狀態 */}
                <Box sx={{ width: 100, flexShrink: 0 }}>
                  {item.type === 'social' && (
                    <StatusChip status={item.socialApplicationStatus} />
                  )}
                </Box>

                {/* 社宅編碼 */}
                <Typography
                  sx={{
                    width: 200,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: '#5bb971',
                    lineHeight: '22px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.socialCode ?? ''}
                </Typography>

                {/* 物件名稱 */}
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#124a57',
                    lineHeight: '22px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </Typography>

                {/* 門牌地址 */}
                <Typography
                  sx={{
                    width: 200,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: 'rgba(36,53,82,0.6)',
                    lineHeight: '22px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.address}
                </Typography>

                {/* 租金 */}
                <Typography
                  sx={{
                    width: 110,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: '#124a57',
                    lineHeight: '22px',
                    textAlign: 'right',
                  }}
                >
                  {item.rent.toLocaleString()} 元/月
                </Typography>

                {/* 坪數 */}
                <Typography
                  sx={{
                    width: 60,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: '#124a57',
                    lineHeight: '22px',
                    textAlign: 'right',
                  }}
                >
                  {item.area} 坪
                </Typography>

                {/* 樓層 */}
                <Typography
                  sx={{
                    width: 90,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: '#124a57',
                    lineHeight: '22px',
                  }}
                >
                  {item.floor}
                </Typography>

                {/* 格局 */}
                <Typography
                  sx={{
                    width: 80,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: '#124a57',
                    lineHeight: '22px',
                  }}
                >
                  {item.layout}
                </Typography>

                {/* 建物型態 */}
                <Typography
                  sx={{
                    width: 80,
                    flexShrink: 0,
                    fontSize: '14px',
                    color: '#124a57',
                    lineHeight: '22px',
                  }}
                >
                  {item.buildingType}
                </Typography>

                {/* 操作按鈕 */}
                <Box sx={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  <IconButton size="small" sx={{ color: 'rgba(36,53,82,0.4)' }}>
                    <MdMoreVert size={18} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 'auto',
              pt: 2,
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)' }}>
              共 {activeProperties.length} 筆
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '14px',
                  color: 'rgba(36,53,82,0.6)',
                  borderRadius: '6px',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  bgcolor: '#31a0e8',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#2090d8' },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <AddRentalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRental}
      />
    </Box>
  );
}
