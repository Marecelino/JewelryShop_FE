import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { brandColors } from '../../../theme/palette'

interface Props {
  createdAt: string
  onExpire?: () => void
}

export const ReservationCountdown: React.FC<Props> = ({ createdAt, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const createdTime = new Date(createdAt).getTime()
    const expireTime = createdTime + 15 * 60 * 1000 // 15 minutes
    return Math.max(0, Math.floor((expireTime - Date.now()) / 1000))
  })

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire()
      return
    }

    const timer = setInterval(() => {
      const createdTime = new Date(createdAt).getTime()
      const expireTime = createdTime + 15 * 60 * 1000
      const remaining = Math.max(0, Math.floor((expireTime - Date.now()) / 1000))
      setSecondsLeft(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
        if (onExpire) onExpire()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [createdAt, secondsLeft, onExpire])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const isUrgent = secondsLeft < 300 // under 5 minutes

  if (secondsLeft <= 0) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.85,
          borderRadius: 2.5,
          backgroundColor: brandColors.errorBg,
          color: brandColors.error,
          border: `1px solid rgba(163, 59, 50, 0.3)`,
          fontWeight: 700,
        }}
      >
        <WarningAmberOutlinedIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Thời gian giữ chỗ 15 phút đã kết thúc
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2.25,
        py: 0.85,
        borderRadius: 2.5,
        backgroundColor: isUrgent ? brandColors.errorBg : brandColors.warningBg,
        color: isUrgent ? brandColors.error : brandColors.warning,
        border: `1.5px solid ${isUrgent ? 'rgba(163, 59, 50, 0.35)' : 'rgba(139, 94, 26, 0.35)'}`,
        boxShadow: isUrgent ? '0 0 16px rgba(163, 59, 50, 0.15)' : 'none',
        transition: 'all 200ms ease',
      }}
    >
      <TimerOutlinedIcon fontSize="small" sx={{ animation: isUrgent ? 'spin 1.5s infinite linear' : 'none' }} />
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Thời Gian Giữ Chỗ Còn Lại:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem' }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </Typography>
      </Box>
    </Box>
  )
}
