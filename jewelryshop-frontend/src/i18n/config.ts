import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonVi from './locales/vi/common.json'
import authVi from './locales/vi/auth.json'
import catalogVi from './locales/vi/catalog.json'
import cartVi from './locales/vi/cart.json'
import orderVi from './locales/vi/order.json'
import adminVi from './locales/vi/admin.json'

import commonEn from './locales/en/common.json'
import authEn from './locales/en/auth.json'
import catalogEn from './locales/en/catalog.json'
import cartEn from './locales/en/cart.json'
import orderEn from './locales/en/order.json'
import adminEn from './locales/en/admin.json'

export const defaultNS = 'common'
export const resources = {
  vi: {
    common: commonVi,
    auth: authVi,
    catalog: catalogVi,
    cart: cartVi,
    order: orderVi,
    admin: adminVi,
  },
  en: {
    common: commonEn,
    auth: authEn,
    catalog: catalogEn,
    cart: cartEn,
    order: orderEn,
    admin: adminEn,
  },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    lng: 'vi',
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

