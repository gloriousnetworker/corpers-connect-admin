import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewReportModal } from '@/app/(admin)/moderation/ReviewReportModal';
import { ReportAction } from '@/types/enums';

describe('ReviewReportModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    isPending: false,
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders the modal title', () => {
    render(<ReviewReportModal {...defaultProps} />);
    expect(screen.getByText('Review Report')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ReviewReportModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Review Report')).not.toBeInTheDocument();
  });

  it('renders all action options', () => {
    render(<ReviewReportModal {...defaultProps} />);
    expect(screen.getByTestId(`action-${ReportAction.DISMISS}`)).toBeInTheDocument();
    expect(screen.getByTestId(`action-${ReportAction.WARN}`)).toBeInTheDocument();
    expect(screen.getByTestId(`action-${ReportAction.REMOVE}`)).toBeInTheDocument();
    expect(screen.getByTestId(`action-${ReportAction.SUSPEND}`)).toBeInTheDocument();
    expect(screen.getByTestId(`action-${ReportAction.ESCALATE}`)).toBeInTheDocument();
  });

  it('renders reason textarea', () => {
    render(<ReviewReportModal {...defaultProps} />);
    expect(screen.getByTestId('review-reason')).toBeInTheDocument();
  });

  it('submit button is disabled when no action selected', () => {
    render(<ReviewReportModal {...defaultProps} />);
    expect(screen.getByTestId('review-confirm-btn')).toBeDisabled();
  });

  it('enables submit button after selecting an action', () => {
    render(<ReviewReportModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId(`action-${ReportAction.DISMISS}`));
    expect(screen.getByTestId('review-confirm-btn')).not.toBeDisabled();
  });

  it('calls onConfirm with selected action when submitted', () => {
    render(<ReviewReportModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId(`action-${ReportAction.WARN}`));
    fireEvent.click(screen.getByTestId('review-confirm-btn'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(ReportAction.WARN, undefined);
  });

  it('calls onConfirm with reason if provided', () => {
    render(<ReviewReportModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId(`action-${ReportAction.REMOVE}`));
    fireEvent.change(screen.getByTestId('review-reason'), { target: { value: 'Violates terms' } });
    fireEvent.click(screen.getByTestId('review-confirm-btn'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(ReportAction.REMOVE, 'Violates terms');
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<ReviewReportModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows "Submitting…" when isPending', () => {
    render(<ReviewReportModal {...defaultProps} isPending />);
    expect(screen.getByTestId('review-confirm-btn')).toHaveTextContent('Submitting…');
  });

  it('disables confirm when isPending', () => {
    render(<ReviewReportModal {...defaultProps} isPending />);
    // Button is disabled by isPending even with action selected
    fireEvent.click(screen.getByTestId(`action-${ReportAction.DISMISS}`));
    expect(screen.getByTestId('review-confirm-btn')).toBeDisabled();
  });
});
