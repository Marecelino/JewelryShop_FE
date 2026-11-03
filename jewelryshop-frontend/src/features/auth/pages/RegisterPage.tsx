import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Container,
} from '@mui/material'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRegisterMutation } from '../api/useAuth'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { brandColors } from '../../../theme/palette'
import { parseApiError } from '../../../api/errorHandler'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Tên đăng nhập phải từ 3 ký tự trở lên')
    .max(50, 'Tên đăng nhập tối đa 50 ký tự'),
  email: z
    .string()
    .email('Địa chỉ email không hợp lệ')
    .max(255, 'Email tối đa 255 ký tự'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải từ 6 ký tự trở lên')
    .max(72, 'Mật khẩu tối đa 72 ký tự'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common'])
  useDocumentTitle(t('auth:registerTitle', 'Đăng Ký'))
  const navigate = useNavigate()

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null)
  const registerMutation = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setApiErrorMessage(null)
    try {
      await registerMutation.mutateAsync(data)
      navigate('/login', {
        state: { registerSuccess: true },
      })
    } catch (err) {
      const parsed = parseApiError(err)
      setApiErrorMessage(
        parsed.status === 409
          ? 'Tên đăng nhập hoặc email đã tồn tại trong hệ thống. Vui lòng chọn thông tin khác.'
          : parsed.message
      )
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: brandColors.background }}>
      {/* Left Column: Haute Joaillerie Atelier Brand Banner (Desktop) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: { md: '45%', lg: '42%' },
          backgroundColor: '#24201D',
          color: '#FFFFFF',
          p: 6,
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 30% 30%, #3A322C 0%, #24201D 70%, #1A1614 100%)',
        }}
      >
        {/* Subtle Gold Concentric Rings */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15%',
            right: '-15%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            border: '1px solid rgba(176, 141, 87, 0.15)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: '#FFFFFF',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(216, 195, 165, 0.3) 0%, rgba(176, 141, 87, 0.2) 100%)',
              border: '1px solid rgba(176, 141, 87, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 24 }} />
          </Box>
          <Typography variant="h1" sx={{ fontSize: '1.4rem', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '0.08em' }}>
            JEWELRY SHOP
          </Typography>
        </Box>

        {/* Hero Narrative */}
        <Box sx={{ zIndex: 1, my: 'auto', py: 6 }}>
          <Typography
            variant="caption"
            sx={{
              color: brandColors.accent,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'block',
              mb: 2,
            }}
          >
            Atelier Membership Privileges
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2.4rem',
              fontWeight: 500,
              lineHeight: 1.25,
              mb: 3,
              color: '#FFFFFF',
            }}
          >
            Trở Thành Khách Hàng Thân Thiết Của JewelryShop
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.7, maxWidth: 440 }}>
            Tạo tài khoản ngay hôm nay để nhận thông báo về các bộ sưu tập kim cương giới hạn và dịch vụ đặt giữ chỗ trang sức vật lý tại quầy showroom.
          </Typography>
        </Box>

        {/* Trust Footnote */}
        <Box sx={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VerifiedOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              100% Vàng Đủ Tuổi
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              Bảo Mật Chuẩn Ngân Hàng
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Column: Clean Register Form Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Container maxWidth="xs" sx={{ p: 0 }}>
          {/* Mobile Brand Link */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: brandColors.primary,
              }}
            >
              <DiamondOutlinedIcon sx={{ color: brandColors.secondary, fontSize: 32 }} />
              <Typography variant="h1" sx={{ fontSize: '1.5rem', fontFamily: '"Playfair Display", Georgia, serif' }}>
                JEWELRY SHOP
              </Typography>
            </Box>
          </Box>

          <Card
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3.5,
              border: `1px solid ${brandColors.border}`,
              boxShadow: '0 12px 32px -8px rgba(47, 41, 37, 0.08)',
              backgroundColor: brandColors.surface,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: '1.65rem',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  mb: 1,
                  textAlign: 'center',
                  color: brandColors.primary,
                }}
              >
                {t('auth:registerTitle', 'Đăng Ký Thành Viên')}
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary, textAlign: 'center', mb: 3 }}>
                Gia nhập câu lạc bộ khách hàng thượng lưu JewelryShop
              </Typography>

              {apiErrorMessage && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
                  {apiErrorMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label={t('auth:username', 'Tên đăng nhập')}
                  fullWidth
                  autoComplete="username"
                  autoFocus
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  {...register('username')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                />

                <TextField
                  label={t('auth:email', 'Địa chỉ Email')}
                  type="email"
                  fullWidth
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                />

                <TextField
                  label={t('auth:password', 'Mật khẩu')}
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isSubmitting || registerMutation.isPending}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(47, 41, 37, 0.2)',
                  }}
                >
                  {isSubmitting || registerMutation.isPending ? 'Đang tạo tài khoản...' : t('auth:registerBtn', 'Hoàn Tất Đăng Ký')}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                    {t('auth:hasAccount', 'Đã có tài khoản?')}{' '}
                    <Link
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: brandColors.secondary,
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {t('auth:loginLink', 'Đăng nhập tại đây')}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  )
}
