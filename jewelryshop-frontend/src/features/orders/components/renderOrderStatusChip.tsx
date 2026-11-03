import { Chip } from '@mui/material'
import type { OrderStatus } from '../../../types/order.types'
import { brandColors } from '../../../theme/palette'

export function renderOrderStatusChip(status: OrderStatus) {
  switch (status) {
    case 'AWAITING_PAYMENT':
      return (
        <Chip
          label="Chờ thanh toán tại quầy"
          size="small"
          sx={{ backgroundColor: brandColors.warningBg, color: brandColors.warning, fontWeight: 700 }}
        />
      )
    case 'CONFIRMED':
      return (
        <Chip
          label="Đã hoàn tất thanh toán"
          size="small"
          sx={{ backgroundColor: brandColors.successBg, color: brandColors.success, fontWeight: 700 }}
        />
      )
    case 'CANCELLED':
      return (
        <Chip
          label="Đã hủy đơn"
          size="small"
          sx={{ backgroundColor: 'rgba(111, 103, 95, 0.1)', color: brandColors.textSecondary }}
        />
      )
    case 'PENDING_RESERVATION':
      return (
        <Chip
          label="Đang giữ chỗ kho..."
          size="small"
          sx={{ backgroundColor: brandColors.infoBg, color: brandColors.info, fontWeight: 700 }}
        />
      )
    default:
      return <Chip label={status} size="small" />
  }
}

