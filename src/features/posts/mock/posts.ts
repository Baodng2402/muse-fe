import {
  CameraIcon,
  PaletteIcon,
  SprayBottleIcon,
} from "@phosphor-icons/react/dist/ssr";

export const CATEGORIES = [
  { id: "makeup", label: "Makeup", icon: PaletteIcon },
  { id: "nail", label: "Nail", icon: SprayBottleIcon },
  { id: "photo", label: "Nhiếp ảnh", icon: CameraIcon },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type PostType = "tim-mau" | "nhan-booking";

export const TYPE_LABEL: Record<PostType, string> = {
  "tim-mau": "Tìm mẫu",
  "nhan-booking": "Nhận booking",
};

export const CITIES = [
  { id: "hcm", label: "TP. Hồ Chí Minh" },
  { id: "hanoi", label: "Hà Nội" },
  { id: "danang", label: "Đà Nẵng" },
] as const;

export type CityId = (typeof CITIES)[number]["id"];

export interface PostAuthor {
  name: string;
  /** Unsplash photo id for avatar */
  avatarId: string;
  level: "Học viên" | "Có kinh nghiệm" | "Chuyên nghiệp";
  rating: number;
  reviewCount: number;
}

export interface Post {
  id: string;
  type: PostType;
  category: CategoryId;
  title: string;
  area: string;
  city: CityId;
  offer: string;
  date: string;
  description: string;
  /** Specific time appointment for model recruitments */
  timeSlot?: string;
  /** Benefit tag for models: "FREE 100%", "HỖ TRỢ 200K", "PHỤ PHÍ 50K", etc. */
  benefitTag?: string;
  benefitType?: "free" | "stipend" | "subsidized" | "discount";
  /** Slot availability */
  slotsTotal?: number;
  slotsAvailable?: number;
  /** Requirements for models */
  requirements?: string;
  /** Price display for pro booking */
  priceDisplay?: string;
  /** Highlight urgent posts */
  isUrgent?: boolean;
  timingCategory?: "today" | "weekend" | "flexible";
  /** Full 10-digit number. Always mask it for guests — see `maskPhone`. */
  phone: string;
  /** Unsplash photo id (the `photo-xxxx` slug from images.unsplash.com). */
  imageId: string;
  author: PostAuthor;
}

/** "0901234567" -> "090•• ••• 567" — how a guest sees the number. */
export function maskPhone(phone: string): string {
  return `${phone.slice(0, 3)}•• ••• ${phone.slice(-3)}`;
}

/** "0901234567" -> "090 123 4567" — how a signed-in user sees the number. */
export function formatPhone(phone: string): string {
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}

/**
 * Listing mock data supporting both Model Recruiting and Pro Booking flows.
 */
export const POSTS: Post[] = [
  {
    id: "1",
    type: "tim-mau",
    category: "makeup",
    title: "Cần 2 bạn mẫu thực hành makeup cô dâu tone Thái",
    area: "Quận 1, TP.HCM",
    city: "hcm",
    offer: "Miễn phí 100%",
    date: "Sáng mai (Chủ nhật)",
    timeSlot: "09:00 - 12:00, Sáng mai",
    benefitTag: "FREE 100%",
    benefitType: "free",
    slotsTotal: 2,
    slotsAvailable: 1,
    requirements: "Da ít khuyết điểm, mí rõ, đồng ý chụp ảnh trước/sau",
    isUrgent: true,
    timingCategory: "weekend",
    description:
      "Học viên makeup cần 2 mẫu nữ thực hành layout cô dâu tone Thái nhẹ nhàng. Được tài trợ toàn bộ mỹ phẩm cao cấp, tặng 5 ảnh chân dung chụp máy cơ đã retouch.",
    phone: "0904561245",
    imageId: "photo-1679141335462-547b83aa99f5",
    author: {
      name: "Ngọc Trinh",
      avatarId: "photo-1494790108377-be9c29b29330",
      level: "Học viên",
      rating: 4.8,
      reviewCount: 14,
    },
  },
  {
    id: "2",
    type: "nhan-booking",
    category: "nail",
    title: "Vẽ nail nghệ thuật & đắp gel phong cách Hàn - Nhật",
    area: "Quận Bình Thạnh, TP.HCM",
    city: "hcm",
    offer: "150.000đ – 350.000đ",
    priceDisplay: "Từ 150.000đ / bộ",
    date: "Nhận lịch trong tuần",
    timingCategory: "flexible",
    description:
      "Thợ nail 3 năm kinh nghiệm, nhận làm nail tại tiệm hoặc tại nhà theo yêu cầu. Bảng mẫu phong phú, sơn nhập khẩu an toàn không hại móng.",
    phone: "0933451812",
    imageId: "photo-1632345031435-8727f6897d53",
    author: {
      name: "Minh Châu",
      avatarId: "photo-1438761681033-6461ffad8d80",
      level: "Chuyên nghiệp",
      rating: 4.9,
      reviewCount: 42,
    },
  },
  {
    id: "3",
    type: "tim-mau",
    category: "photo",
    title: "Tuyển mẫu chụp Lookbook Hè phong cách đường phố (Streetwear)",
    area: "Quận 3, TP.HCM",
    city: "hcm",
    offer: "Hỗ trợ 200k + Ảnh",
    timeSlot: "14:30 Chiều Thứ 3",
    benefitTag: "HỖ TRỢ 200K",
    benefitType: "stipend",
    slotsTotal: 1,
    slotsAvailable: 1,
    requirements: "Nữ, cao từ 1m60, phong cách cá tính, biết pose dáng cơ bản",
    isUrgent: true,
    timingCategory: "today",
    date: "Hôm nay / Thứ 3",
    description:
      "Nhiếp ảnh gia cần 1 bạn mẫu chụp test lookbook brand hè. Có thù lao hỗ trợ xăng xe 200k + trả toàn bộ 150 file gốc và 10 file retouch hoàn chỉnh.",
    phone: "0983001476",
    imageId: "photo-1643217427489-5a58ebbce99e",
    author: {
      name: "Quang Đức",
      avatarId: "photo-1507003211169-0a1dd7228f2d",
      level: "Chuyên nghiệp",
      rating: 4.9,
      reviewCount: 67,
    },
  },
  {
    id: "4",
    type: "nhan-booking",
    category: "makeup",
    title: "Chuyên makeup cô dâu, tiệc cưới & sự kiện cao cấp",
    area: "TP. Thủ Đức, TP.HCM",
    city: "hcm",
    offer: "1.200.000đ / tiệc",
    priceDisplay: "Từ 1.200.000đ / tiệc",
    date: "Đặt lịch linh hoạt",
    timingCategory: "flexible",
    description:
      "Makeup Artist chuyên nghiệp hơn 5 năm trong nghề. Đã thực hiện hơn 200 concept cô dâu sang trọng, tôn nét tự nhiên. Nhận trang điểm tận nơi.",
    phone: "0912203330",
    imageId: "photo-1730486559425-45221a85d6dd",
    author: {
      name: "Thanh Hương",
      avatarId: "photo-1544005313-94ddf0286df2",
      level: "Chuyên nghiệp",
      rating: 5.0,
      reviewCount: 96,
    },
  },
  {
    id: "5",
    type: "tim-mau",
    category: "nail",
    title: "Tìm 2 mẫu tập nối mi Katun & làm nail box",
    area: "Quận Gò Vấp, TP.HCM",
    city: "hcm",
    offer: "Phụ thu 50k",
    timeSlot: "13:30 - 16:30 Chiều mai",
    benefitTag: "PHỤ PHÍ 50K",
    benefitType: "subsidized",
    slotsTotal: 2,
    slotsAvailable: 2,
    requirements: "Mi khỏe chưa từng nối mi nối sợi kim tuyến, móng tay sạch",
    isUrgent: false,
    timingCategory: "weekend",
    date: "Cuối tuần",
    description:
      "Học viên chuẩn bị thi tốt nghiệp cần mẫu thực hành nối mi thiết kế và gắn bộ nail box mẫu mới. Chỉ thu tượng trưng 50k tiền keo và nguyên vật liệu.",
    phone: "0975501902",
    imageId: "photo-1599948128020-9a44505b0d1b",
    author: {
      name: "Thu Thảo",
      avatarId: "photo-1534528741775-53994a69daeb",
      level: "Học viên",
      rating: 4.5,
      reviewCount: 8,
    },
  },
  {
    id: "6",
    type: "nhan-booking",
    category: "photo",
    title: "Chụp ảnh chân dung profile cá nhân & lookbook studio",
    area: "Quận 7, TP.HCM",
    city: "hcm",
    offer: "600.000đ / buổi",
    priceDisplay: "Từ 600.000đ / buổi",
    date: "Nhận lịch cả tuần",
    timingCategory: "flexible",
    description:
      "Studio ánh sáng chuyên nghiệp quận 7. Hỗ trợ tạo dáng, set đèn điện ảnh, trang phục cơ bản. Bàn giao nhanh trong 48h.",
    phone: "0942201158",
    imageId: "photo-1736069997029-b639ab8d33e2",
    author: {
      name: "Anh Khoa",
      avatarId: "photo-1500648767791-00dcc994a43e",
      level: "Chuyên nghiệp",
      rating: 4.8,
      reviewCount: 35,
    },
  },
  {
    id: "7",
    type: "tim-mau",
    category: "makeup",
    title: "Tuyển mẫu thực hành makeup Douyin bắt trend",
    area: "Quận Cầu Giấy, Hà Nội",
    city: "hanoi",
    offer: "Miễn phí + Tặng ảnh",
    timeSlot: "10:00 Sáng Chủ Nhật",
    benefitTag: "FREE 100%",
    benefitType: "free",
    slotsTotal: 1,
    slotsAvailable: 1,
    requirements: "Nữ 18-25 tuổi, thích phong cách trang điểm mắt lấp lánh Douyin",
    isUrgent: true,
    timingCategory: "weekend",
    date: "Chủ nhật tuần này",
    description:
      "Cần 1 bạn mẫu để quay video TikTok và chụp ảnh layout makeup Douyin má hồng say rượu. Miễn phí hoàn toàn và tặng lại video highlight ngắn.",
    phone: "0387652109",
    imageId: "photo-1512496015851-a90fb38ba796",
    author: {
      name: "Lan Phương",
      avatarId: "photo-1580489944761-15a19d654956",
      level: "Có kinh nghiệm",
      rating: 4.7,
      reviewCount: 16,
    },
  },
  {
    id: "8",
    type: "nhan-booking",
    category: "nail",
    title: "Nailbox thiết kế thủ công & Đắp móng úp cao cấp",
    area: "Quận Thanh Xuân, Hà Nội",
    city: "hanoi",
    offer: "200.000đ – 450.000đ",
    priceDisplay: "Từ 200.000đ / bộ",
    date: "Linh hoạt các ngày",
    timingCategory: "flexible",
    description:
      "Thợ làm móng nghệ thuật, đính đá Swarovski bền đẹp. Có nhận đo móng làm nailbox gửi tận nhà hoặc làm trực tiếp tại tiệm.",
    phone: "0967123456",
    imageId: "photo-1604654894610-df63bc536371",
    author: {
      name: "Huyền Trang",
      avatarId: "photo-1488426862026-3ee34a7d66df",
      level: "Chuyên nghiệp",
      rating: 4.9,
      reviewCount: 31,
    },
  },
];
