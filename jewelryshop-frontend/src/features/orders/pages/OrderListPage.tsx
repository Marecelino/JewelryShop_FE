import React, { useState } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Breadcrumbs,
  Link,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Box,
  Tabs,
  Tab,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOrdersQuery } from '../api/useOrders'
import { renderOrderStatusChip } from '../components/renderOrderStatusChip'
import { formatVND } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { TableSkeleton } from '../../../components/common/LoadingSkeleton'
import type { OrderResponse } from '../../../types/order.types'
import type { SpringPage } from '../../../types/api.types'

export const OrderListPage: React.FC = () => {
  const { t, i18n } = useTranslation(['order', 'common'])
  useDocumentTitle(t('order:orderHistoryTitle', 'Lịch Sử Đặt & Giữ Chỗ'))

  const [activeTab, setActiveTab] = useState<string>('all')
  const { data, isLoading, error } = useOrdersQuery()

  // Support both SpringPage<OrderResponse> and OrderResponse[]
  const orders: OrderResponse[] = React.useMemo(() => {
    if (!data) return []
    let list: OrderResponse[] = []
    if (Array.isArray(data)) list = data
    else if ('content' in data && Array.isArray((data as SpringPage<OrderResponse>).content)) {
      list = (data as SpringPage<OrderResponse>).content
    }

    if (activeTab === 'pending') {
      return list.filter((o) => o.status === 'AWAITING_PAYMENT' || o.status === 'PENDING_RESERVATION')
    }
    if (activeTab === 'confirmed') {
      return list.filter((o) => o.status === 'CONFIRMED')
    }
    if (activeTab === 'cancelled') {
      return list.filter((o) => o.status === 'CANCELLED')
    }
    return list
  }, [data, activeTab])

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          {t('common:nav.collection', 'Trang Chủ')}
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>{t('order:orderHistoryTitle', 'Đơn Hàng Của Tôi')}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3.5 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.85rem', md: '2.4rem' }, fontFamily: '"Playfair Display", Georgia, serif', color: brandColors.primary }}>
          {t('order:orderHistoryTitle', 'Lịch Sử Đặt & Giữ Chỗ')}
        </Typography>

        {/* Status Filter Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              py: 0.5,
              px: 2,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
            },
          }}
        >
          <Tab value="all" label="Tất cả" />
          <Tab value="pending" label="Đang giữ chỗ" />
          <Tab value="confirmed" label="Đã hoàn tất" />
          <Tab value="cancelled" label="Đã hủy" />
        </Tabs>
      </Box>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 3 }}>Không thể tải lịch sử đơn hàng từ máy chủ. Vui lòng thử lại sau.</Alert>
      ) : orders.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: `1px solid ${brandColors.border}` }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: brandColors.surfaceSubtle,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: brandColors.secondary,
              mb: 2.5,
            }}
          >
            <ReceiptLongOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h2" sx={{ fontSize: '1.4rem', mb: 1, fontFamily: '"Playfair Display", Georgia, serif' }}>
            Không có đơn đặt giữ chỗ nào trong danh mục này
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3.5, maxWidth: 420, mx: 'auto' }}>
            Khám phá bộ sưu tập trang sức độc bản và đặt lịch trải nghiệm ngay hôm nay.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" sx={{ borderRadius: 2.5, px: 3, py: 1.25 }}>
            {t('common:nav.collection', 'Khám Phá Bộ Sưu Tập')}
          </Button>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 3.5, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: brandColors.surfaceSubtle }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:orderReference', 'Mã đơn hàng')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:orderDate', 'Ngày đặt')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Số lượng món</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:totalAmount', 'Tổng tiền')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>{t('order:orderStatus', 'Trạng thái')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>
                      {t('order:actions', 'Thao tác')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((ord) => (
                    <TableRow key={ord.orderId} hover>
                      <TableCell sx={{ fontWeight: 700, py: 2.5, color: brandColors.primary }}>
                        #{ord.orderReference}
                      </TableCell>
                      <TableCell sx={{ color: brandColors.textSecondary }}>{formatDate(ord.createdAt, i18n.language)}</TableCell>
                      <TableCell>{ord.items?.length || 0} món trang sức</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: brandColors.primary, fontSize: '1rem' }}>
                        {formatVND(ord.totalAmount, i18n.language)}
                      </TableCell>
                      <TableCell>{renderOrderStatusChip(ord.status)}</TableCell>
                      <TableCell align="right">
                        <Button
                          component={RouterLink}
                          to={`/orders/${encodeURIComponent(ord.orderReference)}`}
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            color: brandColors.secondary,
                            fontWeight: 700,
                            borderRadius: 2,
                            '&:hover': { backgroundColor: 'rgba(176, 141, 87, 0.08)' },
                          }}
                        >
                          Chi Tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile Card Stack View */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {orders.map((ord) => (
              <Card key={ord.orderId} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${brandColors.border}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary }}>
                    #{ord.orderReference}
                  </Typography>
                  {renderOrderStatusChip(ord.status)}
                </Box>
                <Typography variant="caption" sx={{ color: brandColors.textSecondary, display: 'block', mb: 1 }}>
                  Ngày tạo: {formatDate(ord.createdAt, i18n.language)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                    {ord.items?.length || 0} món
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.primary }}>
                    {formatVND(ord.totalAmount, i18n.language)}
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to={`/orders/${encodeURIComponent(ord.orderReference)}`}
                  variant="outlined"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Xem Chi Tiết Đơn Hàng
                </Button>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Container>
  )
}
