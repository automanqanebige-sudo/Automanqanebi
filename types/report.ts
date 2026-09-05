export type ReportReason = 'wrong_data' | 'sold' | 'fraud'
export type ReportListingType = 'car' | 'service'
export type ReportStatus = 'open' | 'resolved' | 'dismissed'

export type ListingReport = {
  id: string
  listingId: string
  listingType: ReportListingType
  reason: ReportReason
  message?: string
  reporterId?: string
  reporterEmail?: string
  createdAt: string
  status: ReportStatus
}

export type ListingReportInput = Omit<ListingReport, 'id' | 'createdAt' | 'status'> & {
  status?: ReportStatus
}
