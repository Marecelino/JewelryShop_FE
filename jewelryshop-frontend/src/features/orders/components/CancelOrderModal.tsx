import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { brandColors } from '../../../theme/palette'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  orderReference: string
}

export const CancelOrderModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  isPending,
  orderReference,
}) => {
  const { t } = useTranslation(['order', 'common'])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: brandColors.error, fontWeight: 700 }}>
        {t('order:cancelConfirmTitle', 'Xác nhận hủy đơn giữ chỗ?')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: brandColors.textPrimary, mb: 1.5 }}>
          Bạn đang yêu cầu hủy đơn hàng <strong>#{orderReference}</strong>.
        </DialogContentText>
        <DialogContentText sx={{ color: brandColors.textSecondary, fontSize: '0.9rem' }}>
          {t(
            'order:cancelConfirmBody',
            'Sau khi hủy, các món trang sức vật lý đang giữ chỗ sẽ được hệ thống trả lại quầy trưng bày để phục vụ khách hàng khác. Thao tác này không thể hoàn tác.'
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button onClick={onClose} disabled={isPending} color="inherit">
          {t('common:actions.back', 'Quay Lại')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          variant="contained"
          sx={{
            backgroundColor: brandColors.error,
            color: brandColors.textInverse,
            '&:hover': { backgroundColor: '#8a2f27' },
          }}
        >
          {isPending ? t('common:actions.loading', 'Đang xử lý...') : t('order:confirmCancelBtn', 'Đồng Ý Hủy Đơn')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

