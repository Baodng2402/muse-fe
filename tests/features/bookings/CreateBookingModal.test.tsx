import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateBookingModal } from '@/src/features/bookings/components/CreateBookingModal';
import { renderWithProviders } from '@/tests/test-utils';
import { useAuthStore } from '@/src/shared/store/store.auth';

describe('CreateBookingModal Component', () => {
  it('prompts user to login if unauthenticated', () => {
    useAuthStore.setState({ isAuthenticated: false, user: null, _hasHydrated: true });

    renderWithProviders(
      <CreateBookingModal
        providerProfileId="provider-456"
        providerName="Studio Mai"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Đăng nhập để đặt lịch')).toBeInTheDocument();
  });

  it('renders booking fields when authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 'client-123', email: 'client@example.com', display_name: 'Khách hàng A', roles: ['customer'] },
      _hasHydrated: true,
    });

    renderWithProviders(
      <CreateBookingModal
        providerProfileId="provider-456"
        providerName="Studio Mai"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/đặt lịch hẹn với studio mai/i)).toBeInTheDocument();
    expect(screen.getByText(/thời gian bắt đầu/i)).toBeInTheDocument();
    expect(screen.getByText(/ghi chú hoặc yêu cầu/i)).toBeInTheDocument();
  });
});
