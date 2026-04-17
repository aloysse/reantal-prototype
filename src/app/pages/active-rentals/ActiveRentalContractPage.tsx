import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

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
import {
  MdAdd,
  MdFileDownload,
  MdEdit,
  MdDelete,
  MdArrowRightAlt,
} from 'react-icons/md';
import {
  properties,
  documentTypes,
  contractDocumentItems,
  type ContractDocumentItem,
  type DocumentType,
} from '../../data/mockData';
import PageContainer from '../../components/PageContainer';
import { CATEGORY_ORDER, DocIcon } from './contract-dialogs/contractDialogUtils';
import DocTypeDialog from './contract-dialogs/DocTypeDialog';
import TenantApplicationDialog from './contract-dialogs/TenantApplicationDialog';
import SubLeaseContractDialog from './contract-dialogs/SubLeaseContractDialog';

// ─── 主頁面 ──────────────────────────────────────────────────────────────────

export default function ActiveRentalContractPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const property = isNew ? null : properties.find(p => p.id === id);
  const isSocial = property?.type === 'social';
  const statusTags = isNew ? [{ date: '', label: 'New' }] : (property?.statusTags ?? []);

  const [docs, setDocs] = useState<ContractDocumentItem[]>(
    contractDocumentItems.filter(d => d.propertyId === id)
  );
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [tenantAppOpen,  setTenantAppOpen]  = useState(false);
  const [subLeaseOpen,   setSubLeaseOpen]   = useState(false);

  const usedTypeIds = docs.map(d => d.typeId);

  const handleTypeSelect = (typeId: string) => {
    setTypeDialogOpen(false);
    if (typeId === 'dt2') {
      setTenantAppOpen(true);
    } else if (typeId === 'dt8') {
      setSubLeaseOpen(true);
    }
  };

  const handleDelete = (docId: string) =>
    setDocs(prev => prev.filter(d => d.id !== docId));

  const getDocType = (typeId: string): DocumentType | undefined =>
    documentTypes.find(dt => dt.id === typeId);

  const docsByCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = docs.filter(d => getDocType(d.typeId)?.category === cat);
    return acc;
  }, {} as Record<string, ContractDocumentItem[]>);

  return (
    <PageContainer>

      {/* 狀態標籤 */}
      {/* {statusTags.length > 0 && (
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
      )} */}

      <Box sx={{ bgcolor: '#ffffff', borderRadius: '12px', p: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

        {/* 媒合編號（社宅專用） */}
        {isSocial && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography sx={{ fontSize: '14px', color: 'rgba(36,53,82,0.6)', whiteSpace: 'nowrap' }}>
              媒合編號
            </Typography>
            <TextField
              defaultValue={property?.socialMatchNo ?? ''}
              sx={{ ...inputSx, width: '260px' }}
            />
          </Box>
        )}

        {/* 新增按鈕 */}
        <Button
          startIcon={<MdAdd size={18} />}
          onClick={() => setTypeDialogOpen(true)}
          sx={{
            bgcolor: '#81d394', color: '#fff', fontWeight: 500,
            borderRadius: '8px', px: 2, height: 37, mb: 3,
            '&:hover': { bgcolor: '#6bc480' },
            boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
          }}
        >
          新增契約文件
        </Button>

        {/* 各分類清單 */}
        {CATEGORY_ORDER.map(cat => {
          const catDocs = docsByCategory[cat];
          if (!catDocs || catDocs.length === 0) return null;
          const isContract = cat === '契約';

          return (
            <Box key={cat} sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#124a57', mb: 1.5 }}>
                {cat}
              </Typography>
              <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                <colgroup>
                  <col />
                  {isContract && <col style={{ width: 180 }} />}
                  <col style={{ width: 110 }} />
                  <col style={{ width: 160 }} />
                  <col style={{ width: 80 }} />
                </colgroup>
                <TableHead>
                  <TableRow sx={{
                    '& th': {
                      color: 'rgba(36,53,82,0.6)', fontSize: '13px', fontWeight: 500,
                      borderBottom: '1px solid rgba(36,53,82,0.12)', whiteSpace: 'nowrap',
                      py: 1.5,
                    },
                  }}>
                    <TableCell>文件名稱</TableCell>
                    {isContract && <TableCell align="center">租賃/委託期間</TableCell>}
                    <TableCell align="center">建立時間</TableCell>
                    <TableCell align="center">下載文件</TableCell>
                    <TableCell align="center">編輯</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {catDocs.map(doc => {
                    const dtype = getDocType(doc.typeId);
                    return (
                      <TableRow key={doc.id} sx={{
                        '& td': { borderBottom: '1px solid rgba(36,53,82,0.08)', py: 1.8, whiteSpace: 'nowrap' },
                      }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {dtype && <DocIcon icon={dtype.icon} size={16} />}
                            <Typography sx={{ fontSize: '14px', color: '#124a57', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {dtype?.name ?? doc.typeId}
                            </Typography>
                          </Box>
                        </TableCell>

                        {isContract && (
                          <TableCell align="right">
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography sx={{ fontSize: '13px', color: '#124a57' }}>
                                {doc.rentStart}
                              </Typography>
                              <MdArrowRightAlt size={16} color="rgba(36,53,82,0.5)" />
                              <Typography sx={{ fontSize: '13px', color: '#124a57' }}>
                                {doc.rentEnd}
                              </Typography>
                            </Box>
                          </TableCell>
                        )}

                        <TableCell align="right">
                          <Typography sx={{ fontSize: '13px', color: 'rgba(36,53,82,0.6)' }}>
                            {doc.createdAt}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            startIcon={<MdFileDownload size={16} />}
                            sx={{
                              bgcolor: '#81d394', color: '#fff', fontSize: '13px',
                              borderRadius: '6px', px: 1.5, py: 0.5, height: 30,
                              '&:hover': { bgcolor: '#6bc480' },
                            }}
                          >
                            下載 PDF
                          </Button>
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => setSubLeaseOpen(true)}
                              sx={{ color: '#31a0e8' }}
                            >
                              <MdEdit size={18} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(doc.id)}
                              sx={{ color: '#31a0e8' }}
                            >
                              <MdDelete size={18} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          );
        })}
      </Box>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}
      <DocTypeDialog
        open={typeDialogOpen}
        onClose={() => setTypeDialogOpen(false)}
        usedTypeIds={usedTypeIds}
        onSelect={handleTypeSelect}
      />
      <TenantApplicationDialog
        open={tenantAppOpen}
        onClose={() => setTenantAppOpen(false)}
      />
      <SubLeaseContractDialog
        open={subLeaseOpen}
        onClose={() => setSubLeaseOpen(false)}
      />
    </PageContainer>
  );
}
