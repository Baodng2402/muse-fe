import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CreateReviewModal } from '@/src/features/reviews/components/CreateReviewModal';
import { renderWithProviders } from '../../test-utils';

describe('CreateReviewModal Component', () => {
  it('renders review form when open', () => {
    renderWithProviders(
      <CreateReviewModal
        bookingId="booking-123"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Đánh giá dịch vụ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tay nghề thợ ra sao/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gửi đánh giá/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /để sau/i })).toBeInTheDocument();
  });

  it('updates comment text and allows star selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CreateReviewModal
        bookingId="booking-123"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(/tay nghề thợ ra sao/i);
    await user.type(textarea, 'Thợ makeup rất có tâm, đúng giờ và nhiệt tình!');
    expect(textarea).toHaveValue('Thợ makeup rất có tâm, đúng giờ và nhiệt tình!');

    // Click 4 stars
    const star4 = screen.getByLabelText('4 sao');
    await user.click(star4);
    expect(screen.getByText(/4 \/ 5 sao/i)).toBeInTheDocument();
  });
});
