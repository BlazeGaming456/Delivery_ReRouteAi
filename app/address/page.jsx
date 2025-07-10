'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddressPage () {
  const router = useRouter()
  useEffect(() => {
    router.replace('/delivery')
  }, [router])
  return null
}
