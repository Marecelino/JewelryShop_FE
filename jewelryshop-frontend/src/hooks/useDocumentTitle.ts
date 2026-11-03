import { useEffect } from 'react'

export function useDocumentTitle(title: string, prevailOnUnmount: boolean = false): void {
  useEffect(() => {
    const originalTitle = document.title
    document.title = `${title} — JewelryShop`

    return () => {
      if (!prevailOnUnmount) {
        document.title = originalTitle
      }
    }
  }, [title, prevailOnUnmount])
}

