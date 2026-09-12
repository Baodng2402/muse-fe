import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CompactPostCard } from '@/src/features/posts/components/PostCardCompact';
import type { Post } from '@/src/features/posts/types';

const mockPost: Post = {
  id: 'post-123',
  type: 'tim-mau',
  title: 'Tuyển mẫu makeup cô dâu tone Thái tại Quận 1',
  author: {
    name: 'Lan Anh Studio',
    level: 'Học viên',
    rating: 4.8,
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  area: 'Quận 1, TP. Hồ Chí Minh',
  date: 'Hôm nay',
  timeSlot: '09:00 - 12:00',
  slotsAvailable: 2,
  isUrgent: true,
  benefitType: 'free',
  benefitTag: 'Free 100%',
  offer: 'Free 100%',
  description: 'Chi tiết bài đăng tuyển mẫu makeup',
  isSaved: false,
  imageUrl: 'https://example.com/photo.jpg',
};

describe('PostCardCompact Component', () => {
  it('renders post title, author, and location', () => {
    render(<CompactPostCard post={mockPost} />);

    expect(screen.getByText('Tuyển mẫu makeup cô dâu tone Thái tại Quận 1')).toBeInTheDocument();
    expect(screen.getByText('Lan Anh Studio')).toBeInTheDocument();
    expect(screen.getByText('Quận 1')).toBeInTheDocument();
    expect(screen.getByText('Free 100%')).toBeInTheDocument();
    expect(screen.getByText('2 slot')).toBeInTheDocument();
  });

  it('handles bookmark toggle click', async () => {
    const user = userEvent.setup();
    const handleToggleBookmark = vi.fn();

    render(<CompactPostCard post={mockPost} onToggleBookmark={handleToggleBookmark} />);

    const bookmarkBtn = screen.getByRole('button', { name: /lưu tin này/i });
    await user.click(bookmarkBtn);

    expect(handleToggleBookmark).toHaveBeenCalledTimes(1);
    expect(handleToggleBookmark).toHaveBeenCalledWith('post-123');
  });

  it('renders proper link to post detail', () => {
    render(<CompactPostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/posts/post-123');
  });
});
