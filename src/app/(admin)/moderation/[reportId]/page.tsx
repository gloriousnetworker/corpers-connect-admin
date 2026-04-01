'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, FileText } from 'lucide-react';
import { useReport, useReviewReport } from '@/hooks/useReports';
import { Badge, Spinner } from '@/components/ui';
import { ReviewReportModal } from '../ReviewReportModal';
import {
  formatDate,
  formatRelativeTime,
  getReportStatusColor,
} from '@/lib/utils';
import { ReportStatus } from '@/types/enums';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-foreground-secondary w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right flex-1 min-w-0">{children}</span>
    </div>
  );
}

export default function ReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const router = useRouter();
  const { data: report, isLoading, isError } = useReport(reportId);
  const reviewMutation = useReviewReport(reportId);
  const [reviewOpen, setReviewOpen] = useState(false);

  if (isLoading) {
    return (
      <div data-testid="report-detail-loading" className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div data-testid="report-detail-error" className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-foreground font-medium">Report not found</p>
        <button onClick={() => router.back()} className="text-sm text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const isPending = report.status === ReportStatus.PENDING;

  return (
    <div data-testid="report-detail-page" className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          data-testid="back-button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground capitalize">
            {report.entityType.toLowerCase()} Report
          </h1>
          <p className="text-sm text-foreground-secondary mt-0.5">
            Submitted {formatRelativeTime(report.createdAt)}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getReportStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>

      {/* Report details */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-foreground mb-2">Report Details</p>
        <InfoRow label="Content Type">
          <span className="capitalize">{report.entityType.toLowerCase()}</span>
        </InfoRow>
        <InfoRow label="Reason">{report.reason}</InfoRow>
        {report.details && <InfoRow label="Details">{report.details}</InfoRow>}
        <InfoRow label="Date Reported">{formatDate(report.createdAt)}</InfoRow>
        {report.reviewedAt && (
          <InfoRow label="Reviewed At">{formatDate(report.reviewedAt)}</InfoRow>
        )}
        {report.actionTaken && (
          <InfoRow label="Action Taken">
            <span className="capitalize">{report.actionTaken}</span>
          </InfoRow>
        )}
      </div>

      {/* Content preview */}
      {report.content && (
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={15} className="text-foreground-secondary" />
            <p className="text-sm font-semibold text-foreground">Reported Content</p>
          </div>
          {report.content.authorName && (
            <p className="text-xs text-foreground-secondary mb-2">by {report.content.authorName}</p>
          )}
          {report.content.text && (
            <p className="text-sm text-foreground bg-surface-alt rounded-lg p-3 whitespace-pre-wrap">
              {report.content.text}
            </p>
          )}
          {report.content.mediaUrls && report.content.mediaUrls.length > 0 && (
            <p className="text-xs text-foreground-secondary mt-2">
              {report.content.mediaUrls.length} media attachment(s)
            </p>
          )}
        </div>
      )}

      {/* Reporter */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={15} className="text-foreground-secondary" />
          <p className="text-sm font-semibold text-foreground">Reporter</p>
        </div>
        <InfoRow label="Name">
          {report.reporter.firstName} {report.reporter.lastName}
        </InfoRow>
        <InfoRow label="State Code">{report.reporter.stateCode}</InfoRow>
      </div>

      {/* Reported User */}
      {report.reportedUser && (
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={15} className="text-error" />
            <p className="text-sm font-semibold text-foreground">Reported User</p>
          </div>
          <InfoRow label="Name">
            {report.reportedUser.firstName} {report.reportedUser.lastName}
          </InfoRow>
          <InfoRow label="State Code">{report.reportedUser.stateCode}</InfoRow>
          {report.reportedUserHistory && (
            <>
              <InfoRow label="Prior Warnings">
                <Badge variant={report.reportedUserHistory.priorWarnings > 0 ? 'warning' : 'neutral'}>
                  {report.reportedUserHistory.priorWarnings}
                </Badge>
              </InfoRow>
              <InfoRow label="Prior Suspensions">
                <Badge variant={report.reportedUserHistory.priorSuspensions > 0 ? 'error' : 'neutral'}>
                  {report.reportedUserHistory.priorSuspensions}
                </Badge>
              </InfoRow>
            </>
          )}
        </div>
      )}

      {/* Action */}
      {isPending && (
        <div className="flex justify-end">
          <button
            data-testid="review-report-btn"
            onClick={() => setReviewOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Review Report
          </button>
        </div>
      )}

      <ReviewReportModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={(action, reason) => {
          reviewMutation.mutate({ action, reason });
          setReviewOpen(false);
        }}
        isPending={reviewMutation.isPending}
      />
    </div>
  );
}
