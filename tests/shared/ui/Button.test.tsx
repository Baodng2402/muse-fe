import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/src/shared/components/ui/Button';

describe('Button Component', () => {
  it('renders button with label', () => {
    render(<Button>Xác nhận</Button>);
    const button = screen.getByRole('button', { name: /xác nhận/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Bấm vào đây</Button>);

    const button = screen.getByRole('button', { name: /bấm vào đây/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables clicking when disabled prop is true', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Vô hiệu hóa</Button>);

    const button = screen.getByRole('button', { name: /vô hiệu hóa/i });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes properly', () => {
    const { container, rerender } = render(<Button variant="destructive">Xóa</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive/10');

    rerender(<Button variant="outline">Hủy</Button>);
    expect(container.firstChild).toHaveClass('border-border');
  });

  it('applies size classes properly', () => {
    const { container, rerender } = render(<Button size="lg">Nút Lớn</Button>);
    expect(container.firstChild).toHaveClass('h-11');

    rerender(<Button size="sm">Nút Nhỏ</Button>);
    expect(container.firstChild).toHaveClass('h-8.5');
  });
});
