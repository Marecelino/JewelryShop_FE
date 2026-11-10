import React, { useState, useContext, useMemo } from 'react'
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  MenuItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import { useTranslation } from 'react-i18next'
import {
  useInventoryItemsQuery,
  useCreateInventoryItemMutation,
} from '../api/useAdminApi'
import { useProductsQuery } from '../../catalog/api/useProductsQuery'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import { ToastContext } from '../../../layouts/ToastContext'
import type { InventoryItemResponse, CreateInventoryItemRequest, InventoryItemStatus } from '../../../types/inventory.types'
import type { SpringPage, PagedModel } from '../../../types/api.types'

function renderInventoryStatusChip(status: InventoryItemStatus) {
  switch (status) {
    case 'AVAILABLE':
      return <Chip label="Có sẵn tại quầy" size="small" sx={{ backgroundColor: brandColors.successBg, color: brandColors.success, fontWeight: 700 }} />
    case 'RESERVED':
      return <Chip label="Đang giữ chỗ khách" size="small" sx={{ backgroundColor: brandColors.warningBg, color: brandColors.warning, fontWeight: 700 }} />
    case 'SOLD':
      return <Chip label="Đã bán" size="small" sx={{ backgroundColor: 'rgba(111, 103, 95, 0.12)', color: brandColors.textSecondary, fontWeight: 600 }} />
    case 'DAMAGED':
      return <Chip label="Hư hỏng / Bảo dưỡng" size="small" sx={{ backgroundColor: brandColors.errorBg, color: brandColors.error, fontWeight: 600 }} />
    default:
      return <Chip label={status} size="small" />
  }
}

export const AdminInventoryPage: React.FC = () => {
  useTranslation(['admin', 'common'])
  useDocumentTitle('Kho Trang Sức Vật Lý — Quản Trị')
  const { showToast } = useContext(ToastContext)

  const { data: inventoryData, isLoading, error } = useInventoryItemsQuery()
  const { data: products } = useProductsQuery()
  const createItemMutation = useCreateInventoryItemMutation()

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateInventoryItemRequest>({
    productId: 1,
    barcode: '',
    serialNumber: '',
    actualWeightGrams: 3.75,
    actualGoldPurityPercent: 99.99,
    certificateNumber: '',
    locationCode: 'TRAY-A1',
  })

  // Normalize items array
  const items: InventoryItemResponse[] = useMemo(() => {
    if (!inventoryData) return []
    if (Array.isArray(inventoryData)) return inventoryData
    if ('content' in inventoryData && Array.isArray((inventoryData as SpringPage<InventoryItemResponse>).content)) {
      return (inventoryData as SpringPage<InventoryItemResponse>).content
    }
    if ('content' in inventoryData && Array.isArray((inventoryData as PagedModel<InventoryItemResponse>).content)) {
      return (inventoryData as PagedModel<InventoryItemResponse>).content
    }
    return []
  }, [inventoryData])

  // Overview metrics
  const metrics = useMemo(() => {
    const total = items.length
    const available = items.filter((i) => i.status === 'AVAILABLE').length
    const reserved = items.filter((i) => i.status === 'RESERVED').length
    const sold = items.filter((i) => i.status === 'SOLD').length
    return { total, available, reserved, sold }
  }, [items])

  const handleOpenCreate = () => {
    const firstProdId = products && products.length > 0 ? products[0].productId : 1
    const randomBarcode = 'JW-' + Math.floor(100000 + Math.random() * 900000)
    setFormData({
      productId: firstProdId,
      barcode: randomBarcode,
      serialNumber: 'SR-' + Date.now().toString().slice(-6),
      actualWeightGrams: 3.75,
      actualGoldPurityPercent: 99.99,
      certificateNumber: 'GIA-' + Math.floor(10000 + Math.random() * 90000),
      locationCode: 'TRAY-A1',
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setFormError(null)
    if (!formData.barcode.trim()) {
      setFormError('Mã vạch barcode không được để trống.')
      return
    }

    try {
      await createItemMutation.mutateAsync(formData)
      showToast({ message: 'Nhập kho món trang sức vật lý thành công!', severity: 'success' })
      setModalOpen(false)
    } catch {
      setFormError('Không thể tạo món kho. Barcode hoặc Serial có thể đã trùng lặp.')
    }
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3.5 }}>
        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.75rem', color: brandColors.primary, mb: 0.5 }}>
            Quản Lý Kho Vật Lý & Mã Vạch (Barcode)
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
            Theo dõi từng món trang sức riêng biệt theo số seri, giấy chứng nhận và khay trưng bày
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2.5, px: 3, py: 1.25 }}
        >
          Nhập Kho Món Mới
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 4 }}>
        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Inventory2OutlinedIcon sx={{ color: brandColors.secondary, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Tổng Món Trong Kho
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.primary }}>
                {metrics.total}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleOutlinedIcon sx={{ color: brandColors.success, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Có Sẵn Tại Quầy
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.success }}>
                {metrics.available}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HourglassEmptyOutlinedIcon sx={{ color: brandColors.warning, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Đang Giữ Chỗ Khách
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.warning }}>
                {metrics.reserved}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SellOutlinedIcon sx={{ color: brandColors.textSecondary, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Đã Hoàn Tất Bán
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.textSecondary }}>
                {metrics.sold}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Table Data View */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>Không thể tải dữ liệu kho vật lý từ Inventory Service.</Alert>
      ) : (
        <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0, overflowX: 'auto' }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead sx={{ backgroundColor: brandColors.surfaceSubtle }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã vạch (Barcode)</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Serial / Chứng thư</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Trọng lượng (g)</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Tuổi vàng (%)</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Vị trí khay</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.inventoryItemId} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: brandColors.primary }}>
                      {item.barcode}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {item.serialNumber}
                      </Typography>
                      {item.certificateNumber && (
                        <Typography variant="caption" sx={{ color: brandColors.secondary, display: 'block', fontWeight: 600 }}>
                          GIA: {item.certificateNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>#{item.productId}</TableCell>
                    <TableCell>{item.actualWeightGrams ? `${item.actualWeightGrams} g` : '—'}</TableCell>
                    <TableCell>{item.actualGoldPurityPercent ? `${item.actualGoldPurityPercent}%` : '—'}</TableCell>
                    <TableCell>
                      <Chip label={item.locationCode || 'TRAY-A1'} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
                    </TableCell>
                    <TableCell>{renderInventoryStatusChip(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3.5, p: 1 } } }}
      >
        <DialogTitle sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.4rem' }}>
          Nhập Kho Món Trang Sức Vật Lý Mới
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {formError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            select
            label="Thuộc mẫu sản phẩm nào?"
            fullWidth
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: Number(e.target.value) })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            {products?.map((p) => (
              <MenuItem key={p.productId} value={p.productId}>
                #{p.productId} - {p.productName} ({p.material})
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Mã vạch (Barcode)"
              required
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Số Seri (Serial Number)"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Trọng lượng thực tế (grams)"
              type="number"
              value={formData.actualWeightGrams}
              onChange={(e) => setFormData({ ...formData, actualWeightGrams: Number(e.target.value) })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Độ tinh khiết vàng thực tế (%)"
              type="number"
              value={formData.actualGoldPurityPercent}
              onChange={(e) => setFormData({ ...formData, actualGoldPurityPercent: Number(e.target.value) })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Mã chứng thư giám định (GIA / PNJ)"
              value={formData.certificateNumber}
              onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Vị trí khay (Location Code)"
              value={formData.locationCode}
              onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={createItemMutation.isPending}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {createItemMutation.isPending ? 'Đang tạo...' : 'Xác Nhận Nhập Kho'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
