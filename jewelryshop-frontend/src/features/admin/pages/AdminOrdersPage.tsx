import React, { useState, useContext, useMemo } from 'react'
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Alert,
  TextField,
  MenuItem,
} from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAdminOrdersQuery } from '../api/useAdminApi'
import { useCancelOrderMutation } from '../../orders/api/useOrders'
import { renderOrderStatusChip } from '../../orders/components/renderOrderStatusChip'
import { CancelOrderModal } from '../../orders/components/CancelOrderModal'
import { formatVND } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import { ToastContext } from '../../../layouts/ToastContext'
import type { OrderResponse } from '../../../types/order.types'
import type { SpringPage } from '../../../types/api.types'

export const AdminOrdersPage: React.FC = () => {
  const { t, i18n } = useTranslation(['admin', 'order', 'common'])
  useDocumentTitle('Giám Sát Đơn Hàng — Quản Trị JewelryShop')
  const { showToast } = useContext(ToastContext)

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<string | null>(null)

  const { data, isLoading, error } = useAdminOrdersQuery(
    0,
    30,
    'createdAt,desc',
    statusFilter === 'all' ? undefined : statusFilter
  )

  const cancelMutation = useCancelOrderMutation()

  const orders: OrderResponse[] = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if ('content' in data && Array.isArray((data as SpringPage<OrderResponse>).content)) {
      return (data as SpringPage<OrderResponse>).content
    }
    return []
  }, [data])

  const metrics = useMemo(() => {
    const total = orders.length
    const awaiting = orders.filter((o) => o.status === 'AWAITING_PAYMENT').length
    const confirmed = orders.filter((o) => o.status === 'CONFIRMED').length
    const cancelled = orders.filter((o) => o.status === 'CANCELLED').length
    return { total, awaiting, confirmed, cancelled }
  }, [orders])

  const handleConfirmCancel = async () => {
    if (!selectedOrderToCancel) return
    try {
      await cancelMutation.mutateAsync(selectedOrderToCancel)
      showToast({ message: `Đã hủy đơn #${selectedOrderToCancel} và giải phóng tồn kho`, severity: 'info' })
      setSelectedOrderToCancel(null)
    } catch {
      showToast({ message: 'Không thể hủy đơn hàng này.', severity: 'error' })
    }
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header and Filter */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3.5 }}>
        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.75rem', color: brandColors.primary, mb: 0.5 }}>
            {t('admin:orders.title', 'Giám Sát Đơn Hàng Toàn Hệ Thống')}
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
            Theo dõi tình trạng đơn đặt giữ chỗ 15 phút và xuất phiếu bàn giao tại quầy
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          label="Lọc theo trạng thái"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 260 },
            '& .MuiOutlinedInput-root': { borderRadius: 2.5, backgroundColor: brandColors.surface },
          }}
        >
          <MenuItem value="all">Tất cả trạng thái</MenuItem>
          <MenuItem value="AWAITING_PAYMENT">Chờ thanh toán tại quầy</MenuItem>
          <MenuItem value="PENDING_RESERVATION">Đang giữ chỗ</MenuItem>
          <MenuItem value="CONFIRMED">Đã hoàn tất thanh toán</MenuItem>
          <MenuItem value="CANCELLED">Đã hủy đơn</MenuItem>
        </TextField>
      </Box>

      {/* Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 4 }}>
        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AssignmentOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Tổng Đơn Giám Sát
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.primary }}>
                {metrics.total}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HourglassEmptyOutlinedIcon sx={{ color: brandColors.warning, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Chờ Khách Đến Quầy
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.warning }}>
                {metrics.awaiting}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleOutlinedIcon sx={{ color: brandColors.success, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Đã Hoàn Tất Bán
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.success }}>
                {metrics.confirmed}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CancelOutlinedIcon sx={{ color: brandColors.error, fontSize: 26 }} />
            <Box>
              <Typography variant="caption" sx={{ color: brandColors.textSecondary, textTransform: 'uppercase' }}>
                Đã Hủy / Hết Hạn
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 800, color: brandColors.error }}>
                {metrics.cancelled}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Table Data View */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>Không thể tải danh sách đơn hàng quản trị từ Order Service.</Alert>
      ) : orders.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</Alert>
      ) : (
        <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead sx={{ backgroundColor: brandColors.surfaceSubtle }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã đơn</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Ngày đặt</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Mã khách hàng</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Số món</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Tổng tiền</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((ord) => {
                  const canCancel = ord.status === 'AWAITING_PAYMENT' || ord.status === 'PENDING_RESERVATION'
                  return (
                    <TableRow key={ord.orderId} hover>
                      <TableCell sx={{ fontWeight: 700, color: brandColors.primary }}>
                        #{ord.orderReference}
                      </TableCell>
                      <TableCell sx={{ color: brandColors.textSecondary }}>{formatDate(ord.createdAt, i18n.language)}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>#{ord.userId}</TableCell>
                      <TableCell>{ord.items?.length || 0} món</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: brandColors.primary }}>
                        {formatVND(ord.totalAmount, i18n.language)}
                      </TableCell>
                      <TableCell>{renderOrderStatusChip(ord.status)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            component={RouterLink}
                            to={`/orders/${encodeURIComponent(ord.orderReference)}`}
                            size="small"
                            sx={{ color: brandColors.secondary, fontWeight: 700 }}
                          >
                            Chi Tiết
                          </Button>
                          {canCancel && (
                            <Button
                              size="small"
                              onClick={() => setSelectedOrderToCancel(ord.orderReference)}
                              sx={{
                                color: brandColors.error,
                                fontWeight: 600,
                                '&:hover': { backgroundColor: brandColors.errorBg },
                              }}
                            >
                              Hủy Đơn
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Cancel Order Confirmation Modal */}
      {selectedOrderToCancel && (
        <CancelOrderModal
          open={Boolean(selectedOrderToCancel)}
          onClose={() => setSelectedOrderToCancel(null)}
          onConfirm={handleConfirmCancel}
          isPending={cancelMutation.isPending}
          orderReference={selectedOrderToCancel}
        />
      )}
    </Box>
  )
}
