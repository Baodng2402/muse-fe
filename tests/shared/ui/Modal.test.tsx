import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from '@/src/shared/components/ui/Modal';
import { Button } from '@/src/shared/components/ui/Button';

describe('Modal Component', () => {
  it('renders modal content when open', () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Tiêu đề Modal</ModalTitle>
            <ModalDescription>Mô tả chi tiết modal</ModalDescription>
          </ModalHeader>
          <div>Nội dung bên trong</div>
          <ModalFooter>
            <Button>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

    expect(screen.getByText('Tiêu đề Modal')).toBeInTheDocument();
    expect(screen.getByText('Mô tả chi tiết modal')).toBeInTheDocument();
    expect(screen.getByText('Nội dung bên trong')).toBeInTheDocument();
  });

  it('triggers open state change', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Modal open={false} onOpenChange={handleOpenChange}>
        <ModalTrigger>Mở Modal</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Tiêu đề</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    );

    const trigger = screen.getByRole('button', { name: /mở modal/i });
    await user.click(trigger);
    expect(handleOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
