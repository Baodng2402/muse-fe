import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/src/shared/components/ui/Select';

describe('Select Component', () => {
  it('renders trigger with placeholder', () => {
    render(
      <Select defaultValue="hanoi">
        <SelectTrigger aria-label="Chọn khu vực">
          <SelectValue placeholder="Chọn tỉnh thành" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hanoi">Hà Nội</SelectItem>
          <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
  });

  it('renders options correctly inside content', () => {
    render(
      <Select open>
        <SelectTrigger aria-label="Chọn khu vực">
          <SelectValue placeholder="Chọn khu vực" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="uuid-1">Hà Nội</SelectItem>
          <SelectItem value="uuid-2">Đà Nẵng</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Hà Nội')).toBeInTheDocument();
    expect(screen.getByText('Đà Nẵng')).toBeInTheDocument();
  });
});
