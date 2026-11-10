import React, { useState, useContext } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOrderDetailQuery, useCancelOrderMutation } from '../api/useOrders'
import { ReservationCountdown } from '../components/ReservationCountdown'
import { CancelOrderModal } from '../components/CancelOrderModal'
import { renderOrderStatusChip } from '../components/renderOrderStatusChip'
import { formatVND } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import { ToastContext } from '../../../layouts/ToastContext'
import { parseApiError } from '../../../api/errorHandler'

export const OrderDetailPage: React.FC = () => {
  const { orderReference } = useParams<{ orderReference: string }>()
  const { t, i18n } = useTranslation(['order', 'common'])
  useDocumentTitle(orderReference ? `Đơn Hàng #${orderReference}` : 'Chi Tiết Đơn Hàng')
  const { showToast } = useContext(ToastContext)

  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const { data: order, isLoading, error } = useOrderDetailQuery(orderReference)
  const cancelMutation = useCancelOrderMutation()

  const handleConfirmCancel = async () => {
    if (!orderReference) return
    setCancelError(null)
    try {
      await cancelMutation.mutateAsync(orderReference)
      setCancelModalOpen(false)
      showToast({
        message: t('order:cancelSuccess', 'Đã hủy đơn hàng và giải phóng món vật lý thành công.'),
        severity: 'info',
      })
    } catch (err) {
      const parsed = parseApiError(err)
      setCancelError(parsed.message || 'Không thể hủy đơn hàng vào lúc này.')
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <TableSkeleton rows={6} />
      </Container>
    )
  }

  if (error || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Không tìm thấy đơn hàng với mã tham chiếu <strong>#{orderReference}</strong>.
        </Alert>
        <Button component={RouterLink} to="/orders" variant="contained" sx={{ borderRadius: 2.5 }}>
          Quay lại danh sách đơn hàng
        </Button>
      </Container>
    )
  }

  const canCancel = order.status === 'AWAITING_PAYMENT' || order.status === 'PENDING_RESERVATION'

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          {t('common:nav.collection', 'Trang Chủ')}
        </Link>
        <Link component={RouterLink} to="/orders" color="inherit" underline="hover">
          {t('order:orderHistoryTitle', 'Đơn Hàng Của Tôi')}
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>#{order.orderReference}</Typography>
      </Breadcrumbs>

      {/* Header and Countdown row */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2.5, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', md: '2.2rem' }, fontFamily: '"Playfair Display", Georgia, serif', color: brandColors.primary }}>
              Đơn Giữ Chỗ #{order.orderReference}
            </Typography>
            {renderOrderStatusChip(order.status)}
          </Box>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
            Thời gian tạo đơn: {formatDate(order.createdAt, i18n.language)}
          </Typography>
        </Box>

        {order.status === 'AWAITING_PAYMENT' && (
          <ReservationCountdown createdAt={order.createdAt} />
        )}
      </Box>

      {/* Showroom Pickup Pass Voucher Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3.5,
          border: `1.5px dashed ${brandColors.borderStrong}`,
          backgroundColor: brandColors.surfaceSubtle,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 2.5,
                backgroundColor: brandColors.surface,
                border: `1px solid ${brandColors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: brandColors.secondary,
              }}
            >
              <QrCode2OutlinedIcon sx={{ fontSize: 36 }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, color: brandColors.primary, mb: 0.5 }}>
                Phiếu Tiếp Đón Tại Quầy Showroom
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Vui lòng đưa mã <strong style={{ color: brandColors.primary }}>#{order.orderReference}</strong> cho chuyên viên tư vấn khi đến tiệm kim hoàn.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: brandColors.secondary }}>
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Showroom Tòa nhà Kim Hoàn, Hà Nội
            </Typography>
          </Box>
        </Box>
      </Card>

      {order.status === 'PENDING_RESERVATION' && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          {t(
            'order:reservationPending',
            'Đơn hàng đang chờ đồng bộ kho vật lý (202 Accepted). Hệ thống đang tự động kiểm tra lại...'
          )}
        </Alert>
      )}

      {cancelError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {cancelError}
        </Alert>
      )}

      {/* Items Table Card */}
      <Card sx={{ mb: 4, borderRadius: 3.5, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ backgroundColor: brandColors.surfaceSubtle }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Tên món trang sức</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:reservedItemRef', 'Mã giữ chỗ')}</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:unitPrice', 'Đơn giá')}</TableCell>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:itemStatus', 'Tình trạng món')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((item) => (
                <TableRow key={item.orderItemId} hover>
                  <TableCell sx={{ fontWeight: 600, py: 2.5 }}>{item.productNameSnapshot}</TableCell>
                  <TableCell sx={{ color: brandColors.textSecondary, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {item.orderItemReference}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2.5 }}>
                    {formatVND(item.unitPrice, i18n.language)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: item.status === 'RESERVED' ? brandColors.success : brandColors.textSecondary }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: item.status === 'RESERVED' ? brandColors.success : brandColors.textSecondary }}>
                        {item.status}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary and Cancel Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          gap: 2.5,
          p: 3,
          borderRadius: 3.5,
          backgroundColor: brandColors.surface,
          border: `1px solid ${brandColors.border}`,
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 0.5 }}>
            Tổng giá trị thanh toán tại quầy khi nhận món:
          </Typography>
          <Typography variant="h2" sx={{ fontSize: '1.85rem', fontWeight: 800, color: brandColors.primary }}>
            {formatVND(order.totalAmount, i18n.language)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={RouterLink} to="/orders" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 2.5, px: 2.5 }}>
            Danh Sách Đơn
          </Button>

          {canCancel && (
            <Button
              variant="contained"
              startIcon={<CancelOutlinedIcon />}
              onClick={() => setCancelModalOpen(true)}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                backgroundColor: 'rgba(163, 59, 50, 0.1)',
                color: brandColors.error,
                boxShadow: 'none',
                '&:hover': { backgroundColor: 'rgba(163, 59, 50, 0.2)' },
              }}
            >
              {t('order:cancelOrder', 'Hủy Giữ Chỗ Món Hàng')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Cancel Confirmation Modal */}
      <CancelOrderModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isPending={cancelMutation.isPending}
        orderReference={order.orderReference}
      />
    </Container>
  )
}
