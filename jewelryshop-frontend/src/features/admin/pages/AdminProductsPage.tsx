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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  MenuItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { JewelryIllustration } from '../../../components/common/JewelryIllustration'
import { useTranslation } from 'react-i18next'
import { useProductsQuery } from '../../catalog/api/useProductsQuery'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../api/useAdminApi'
import { formatVND } from '../../../utils/formatCurrency'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import { ToastContext } from '../../../layouts/ToastContext'
import type { ProductResponse, CreateProductRequest, UpdateProductRequest } from '../../../types/product.types'

const CATEGORY_OPTIONS = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants']

export const AdminProductsPage: React.FC = () => {
  const { i18n } = useTranslation(['admin', 'common', 'catalog'])
  useDocumentTitle('Quản Lý Danh Mục — Quản Trị JewelryShop')
  const { showToast } = useContext(ToastContext)

  const { data: products, isLoading, error } = useProductsQuery()
  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const deleteMutation = useDeleteProductMutation()

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [formData, setFormData] = useState<CreateProductRequest & { active: boolean }>({
    productName: '',
    category: 'Rings',
    material: 'Vàng 18K',
    gemstone: '',
    price: 5000000,
    description: '',
    active: true,
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Metrics
  const metrics = useMemo(() => {
    if (!products) return { total: 0, active: 0, inactive: 0 }
    const total = products.length
    const active = products.filter((p) => p.active).length
    return { total, active, inactive: total - active }
  }, [products])

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setSelectedFiles([])
    setPreviewUrls([])
    setFormData({
      productName: '',
      category: 'Rings',
      material: 'Vàng 18K',
      gemstone: '',
      price: 5000000,
      description: '',
      active: true,
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (p: ProductResponse) => {
    setEditingProduct(p)
    setSelectedFiles([])
    setPreviewUrls([])
    setFormData({
      productName: p.productName,
      category: p.category,
      material: p.material,
      gemstone: p.gemstone || '',
      price: p.price,
      description: p.description || '',
      active: p.active,
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    if (files.length + selectedFiles.length > 8) {
      showToast({ message: 'Tối đa 8 ảnh cho mỗi sản phẩm', severity: 'warning' })
      return
    }
    const updated = [...selectedFiles, ...files]
    setSelectedFiles(updated)
    setPreviewUrls(updated.map((f) => URL.createObjectURL(f)))
  }

  const handleRemoveFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    setPreviewUrls(updated.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    setFormError(null)
    if (!formData.productName.trim()) {
      setFormError('Tên sản phẩm không được để trống.')
      return
    }
    if (formData.price <= 0) {
      setFormError('Giá bán phải lớn hơn 0.')
      return
    }

    try {
      if (editingProduct) {
        const updatePayload: UpdateProductRequest = {
          productName: formData.productName,
          category: formData.category,
          material: formData.material,
          gemstone: formData.gemstone || undefined,
          price: formData.price,
          description: formData.description || undefined,
          active: formData.active,
        }
        await updateMutation.mutateAsync({ id: editingProduct.productId, payload: updatePayload })
        showToast({ message: 'Cập nhật món trang sức thành công!', severity: 'success' })
      } else {
        const createPayload: CreateProductRequest = {
          productName: formData.productName,
          category: formData.category,
          material: formData.material,
          gemstone: formData.gemstone || undefined,
          price: formData.price,
          description: formData.description || undefined,
        }
        if (selectedFiles.length > 0) {
          const formDataPayload = new FormData()
          const productBlob = new Blob([JSON.stringify(createPayload)], { type: 'application/json' })
          formDataPayload.append('product', productBlob)
          selectedFiles.forEach((file) => {
            formDataPayload.append('images', file)
          })
          await createMutation.mutateAsync(formDataPayload)
        } else {
          await createMutation.mutateAsync(createPayload)
        }
        showToast({ message: 'Thêm mới mẫu trang sức thành công!', severity: 'success' })
      }
      setModalOpen(false)
    } catch {
      setFormError('Không thể lưu thông tin sản phẩm. Vui lòng thử lại.')
    }
  }

  const handleDelete = async (productId: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa/ngừng mẫu "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(productId)
        showToast({ message: `Đã xóa mẫu "${name}"`, severity: 'info' })
      } catch {
        showToast({ message: 'Không thể xóa món hàng này do ràng buộc tồn kho.', severity: 'error' })
      }
    }
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3.5 }}>
        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.75rem', color: brandColors.primary, mb: 0.5 }}>
            Quản Lý Danh Mục Trang Sức
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
            Quản trị thông tin niêm yết, phân loại và giá bán cho showroom
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2.5, px: 3, py: 1.25 }}
        >
          Thêm Mẫu Mới
        </Button>
      </Box>

      {/* SaaS Overview Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5, mb: 4 }}>
        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Tổng Số Mẫu Mã
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.6rem', fontWeight: 800, color: brandColors.primary }}>
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
                Đang Kinh Doanh
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.6rem', fontWeight: 800, color: brandColors.success }}>
                {metrics.active}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <RemoveCircleOutlinedIcon sx={{ color: brandColors.error, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Tạm Ngừng Kinh Doanh
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.6rem', fontWeight: 800, color: brandColors.error }}>
                {metrics.inactive}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Table Data View */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>Không thể tải danh sách sản phẩm quản trị từ Product Service.</Alert>
      ) : (
        <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ backgroundColor: brandColors.surfaceSubtle }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Tên món trang sức</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Phân loại</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Chất liệu / Đá quý</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Giá niêm yết</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((p) => (
                  <TableRow key={p.productId} hover>
                    <TableCell sx={{ color: brandColors.textSecondary, fontFamily: 'monospace' }}>
                      #{p.productId}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {p.primaryImageUrl ? (
                          <Box
                            component="img"
                            src={p.primaryImageUrl}
                            alt={p.productName}
                            sx={{
                              width: 38,
                              height: 48,
                              borderRadius: 1.5,
                              objectFit: 'cover',
                              flexShrink: 0,
                              border: `1px solid ${brandColors.border}`,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 38,
                              height: 48,
                              borderRadius: 1.5,
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: `1px solid ${brandColors.border}`,
                            }}
                          >
                            <JewelryIllustration category={p.category} ratio="4/5" />
                          </Box>
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {p.productName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={p.category} size="small" sx={{ borderRadius: 1.5, fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ color: brandColors.textSecondary, fontSize: '0.875rem' }}>
                      {p.material} {p.gemstone ? `• ${p.gemstone}` : ''}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: brandColors.primary }}>
                      {formatVND(p.price, i18n.language)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.active ? 'Kinh doanh' : 'Ngừng bán'}
                        size="small"
                        sx={{
                          backgroundColor: p.active ? brandColors.successBg : 'rgba(111, 103, 95, 0.1)',
                          color: p.active ? brandColors.success : brandColors.textSecondary,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(p)}
                        sx={{ color: brandColors.secondary, mr: 1 }}
                        aria-label="Chỉnh sửa"
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(p.productId, p.productName)}
                        sx={{ color: brandColors.textSecondary, '&:hover': { color: brandColors.error } }}
                        aria-label="Xóa"
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3.5, p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.4rem' }}>
          {editingProduct ? 'Chỉnh Sửa Mẫu Trang Sức' : 'Thêm Mẫu Trang Sức Mới'}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {formError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            label="Tên món trang sức"
            fullWidth
            required
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="Thể loại"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Chất liệu chính"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Đá quý đính kèm"
              value={formData.gemstone}
              onChange={(e) => setFormData({ ...formData, gemstone: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              label="Giá niêm yết (VNĐ)"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <TextField
            label="Mô tả chế tác"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {!editingProduct && (
            <Box sx={{ mt: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: brandColors.textSecondary,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'block',
                  mb: 1,
                }}
              >
                Hình Ảnh Thư Viện (Tối đa 8 ảnh, ảnh đầu tiên là ảnh đại diện)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateOutlinedIcon />}
                sx={{
                  borderRadius: 2.5,
                  borderStyle: 'dashed',
                  borderWidth: 1.5,
                  borderColor: brandColors.borderStrong,
                  width: '100%',
                  py: 1.5,
                  color: brandColors.textPrimary,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: brandColors.secondary,
                    backgroundColor: brandColors.surfaceSubtle,
                  },
                }}
              >
                Chọn Ảnh Từ Thiết Bị (JPEG, PNG, WEBP &lt; 5MB)
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </Button>

              {previewUrls.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    mt: 2,
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': { height: 4 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: brandColors.border, borderRadius: 2 },
                  }}
                >
                  {previewUrls.map((url, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: 'relative',
                        width: 72,
                        height: 90,
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: idx === 0 ? `2px solid ${brandColors.secondary}` : `1px solid ${brandColors.border}`,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(idx)}
                        sx={{
                          position: 'absolute',
                          top: 3,
                          right: 3,
                          bgcolor: 'rgba(47, 41, 37, 0.75)',
                          color: '#FFFFFF',
                          p: 0.3,
                          '&:hover': { bgcolor: brandColors.error },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                      {idx === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            bgcolor: brandColors.secondary,
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            py: 0.25,
                          }}
                        >
                          Ảnh chính
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {editingProduct && (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  color="secondary"
                />
              }
              label="Kích hoạt kinh doanh (Hiển thị trên storefront)"
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
