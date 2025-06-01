import React from 'react'
import OverviewPage from './overview/page'
import QuickStats from './components/QuickStats'
import AdminGuard from './admin-guard'

export default function Page() {
  return (
    <AdminGuard>
      <OverviewPage/>
    </AdminGuard>
  )
}
