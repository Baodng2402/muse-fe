import {
  CameraIcon,
  PaletteIcon,
  SprayBottleIcon,
  TagIcon,
} from '@phosphor-icons/react/dist/ssr';
import type { IconProps } from '@phosphor-icons/react';

/**
 * Icon trang trí theo tên chuyên ngành THẬT lấy từ API `/specialties` — chỉ ánh xạ hiển thị,
 * không phải dữ liệu. Tên chuyên ngành lạ (chưa có trong map) vẫn hiển thị bình thường,
 * chỉ dùng icon mặc định (TagIcon).
 */
export function SpecialtyIcon({
  specialtyName,
  ...props
}: IconProps & { specialtyName?: string }) {
  switch (specialtyName) {
    case 'Trang điểm':
      return <PaletteIcon {...props} />;
    case 'Nail':
      return <SprayBottleIcon {...props} />;
    case 'Chụp ảnh':
      return <CameraIcon {...props} />;
    default:
      return <TagIcon {...props} />;
  }
}
