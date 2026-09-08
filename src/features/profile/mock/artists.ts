export interface ArtistReview {
  id: string;
  authorName: string;
  authorAvatarId: string;
  role: "Mẫu ảnh thực hành" | "Khách hàng booking";
  rating: number;
  date: string;
  comment: string;
  photoId?: string;
  tag: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageId: string;
  likes: number;
}

export interface ArtistProfile {
  username: string;
  name: string;
  title: string;
  level: "Học viên xuất sắc" | "Có kinh nghiệm" | "Chuyên nghiệp" | "Top Artist";
  verified: boolean;
  avatarId: string;
  coverImageId: string;
  area: string;
  phone: string;
  zaloPhone: string;
  instagram?: string;
  rating: number;
  reviewCount: number;
  completedPostsCount: number;
  bio: string;
  specialties: string[];
  portfolio: PortfolioItem[];
  reviews: ArtistReview[];
}

export const ARTIST_PROFILES: Record<string, ArtistProfile> = {
  "thanhhuong.pro": {
    username: "thanhhuong.pro",
    name: "Thanh Hương",
    title: "Chuyên gia Trang điểm & Cô dâu",
    level: "Top Artist",
    verified: true,
    avatarId: "photo-1544005313-94ddf0286df2",
    coverImageId: "photo-1522337360788-8b13dee7a37e",
    area: "TP. Thủ Đức & Quận 1, TP.HCM",
    phone: "0912203330",
    zaloPhone: "0912203330",
    instagram: "thanhhuong_makeup",
    rating: 5.0,
    reviewCount: 96,
    completedPostsCount: 142,
    bio: "Hơn 5 năm kinh nghiệm chuyên makeup cô dâu phong cách sang trọng, tôn đường nét tự nhiên. Nhận đào tạo học viên kèm 1:1 và tuyển mẫu định kỳ hàng tuần.",
    specialties: ["Makeup cô dâu", "Tone Thái Lan", "Makeup dự tiệc", "Chụp kỷ yếu"],
    portfolio: [
      { id: "p1", title: "Cô dâu Tone Thái Luxe", category: "Makeup", imageId: "photo-1512496015851-a90fb38ba796", likes: 245 },
      { id: "p2", title: "Layout Tiệc Tối Sang Trọng", category: "Makeup", imageId: "photo-1679141335462-547b83aa99f5", likes: 189 },
      { id: "p3", title: "Natural Glow Lookbook", category: "Makeup", imageId: "photo-1534528741775-53994a69daeb", likes: 312 },
      { id: "p4", title: "Cô dâu áo dài truyền thống", category: "Makeup", imageId: "photo-1730486559425-45221a85d6dd", likes: 154 },
      { id: "p5", title: "Editorial Fashion Week", category: "Makeup", imageId: "photo-1580489944761-15a19d654956", likes: 278 },
      { id: "p6", title: "Makeup Clean Girl", category: "Makeup", imageId: "photo-1494790108377-be9c29b29330", likes: 420 },
    ],
    reviews: [
      {
        id: "r1",
        authorName: "Khánh Linh",
        authorAvatarId: "photo-1517841905240-472988babdf9",
        role: "Mẫu ảnh thực hành",
        rating: 5,
        date: "2 ngày trước",
        comment: "Chị Hương siêu nhiệt tình và làm nhẹ tay cực kỳ. Da mình nhạy cảm nhưng chị dùng đồ highend xịn nên không hề bị kích ứng. Lên hình xinh lung linh luôn!",
        photoId: "photo-1512496015851-a90fb38ba796",
        tag: "Makeup cô dâu",
      },
      {
        id: "r2",
        authorName: "Minh Anh",
        authorAvatarId: "photo-1524504388940-b1c1722653e1",
        role: "Khách hàng booking",
        rating: 5,
        date: "1 tuần trước",
        comment: "Đặt lịch chị make ăn tiệc cưới bạn thân, ai gặp cũng khen lớp nền trong veo không bị mốc. Giữ tone được cả ngày luôn ạ.",
        tag: "Tiệc sang trọng",
      },
    ],
  },
  "quangduc.photo": {
    username: "quangduc.photo",
    name: "Quang Đức",
    title: "Nhiếp ảnh gia & Retoucher",
    level: "Chuyên nghiệp",
    verified: true,
    avatarId: "photo-1507003211169-0a1dd7228f2d",
    coverImageId: "photo-1643217427489-5a58ebbce99e",
    area: "Quận 3 & Quận 1, TP.HCM",
    phone: "0983001476",
    zaloPhone: "0983001476",
    instagram: "quangduc_frames",
    rating: 4.9,
    reviewCount: 67,
    completedPostsCount: 89,
    bio: "Chuyên chụp lookbook thời trang thương hiệu, ảnh chân dung nghệ thuật và phong cách đường phố (Streetwear). Luôn tìm kiếm mẫu mới để sáng tạo concept.",
    specialties: ["Lookbook thời trang", "Streetwear", "Chân dung studio", "Ngoại cảnh cinematic"],
    portfolio: [
      { id: "q1", title: "Summer Streetwear Vibe", category: "Photo", imageId: "photo-1643217427489-5a58ebbce99e", likes: 340 },
      { id: "q2", title: "Chân dung Studio Cinematic", category: "Photo", imageId: "photo-1736069997029-b639ab8d33e2", likes: 215 },
      { id: "q3", title: "Vintage Saigon 90s", category: "Photo", imageId: "photo-1522337360788-8b13dee7a37e", likes: 489 },
      { id: "q4", title: "Minimalist Lookbook", category: "Photo", imageId: "photo-1500648767791-00dcc994a43e", likes: 172 },
    ],
    reviews: [
      {
        id: "rq1",
        authorName: "Hoàng Yến",
        authorAvatarId: "photo-1534528741775-53994a69daeb",
        role: "Mẫu ảnh thực hành",
        rating: 5,
        date: "3 ngày trước",
        comment: "Anh Đức hướng dẫn tạo dáng rất tận tình, không khí buổi chụp cực thoải mái. Tối về nhận được link Drive cả file gốc và file chỉnh sửa siêu nhanh.",
        tag: "Lookbook Hè",
      },
    ],
  },
  "minhchau.nails": {
    username: "minhchau.nails",
    name: "Minh Châu",
    title: "Nail Artist & Giảng viên Nailbox",
    level: "Chuyên nghiệp",
    verified: true,
    avatarId: "photo-1438761681033-6461ffad8d80",
    coverImageId: "photo-1632345031435-8727f6897d53",
    area: "Bình Thạnh, TP.HCM",
    phone: "0933451812",
    zaloPhone: "0933451812",
    instagram: "minhchau_nailart",
    rating: 4.9,
    reviewCount: 42,
    completedPostsCount: 76,
    bio: "Vẽ móng nghệ thuật, đắp gel chuẩn form Hàn - Nhật. Sơn gel an toàn không hại móng. Nhận mẫu test form móng mới và đo nailbox thủ công.",
    specialties: ["Vẽ móng nghệ thuật", "Nailbox thủ công", "Đắp gel ẩn hoa", "Nối mi Katun"],
    portfolio: [
      { id: "m1", title: "Nailbox Ombre Thạch Hồng", category: "Nail", imageId: "photo-1632345031435-8727f6897d53", likes: 260 },
      { id: "m2", title: "Form Thang Đính Đá Nhẹ", category: "Nail", imageId: "photo-1604654894610-df63bc536371", likes: 198 },
      { id: "m3", title: "Vẽ Hoa Nổi 3D Pastel", category: "Nail", imageId: "photo-1599948128020-9a44505b0d1b", likes: 310 },
    ],
    reviews: [
      {
        id: "rm1",
        authorName: "Ngọc Mai",
        authorAvatarId: "photo-1494790108377-be9c29b29330",
        role: "Mẫu ảnh thực hành",
        rating: 5,
        date: "Hôm qua",
        comment: "Bộ nail móng úp giữ được hơn 3 tuần vẫn chắc chắn không bị hở mép. Chị Châu làm kỹ và tỉ mỉ từng ngón.",
        tag: "Nail móng úp",
      },
    ],
  },
  "ngoctrinh.makeup": {
    username: "ngoctrinh.makeup",
    name: "Ngọc Trinh",
    title: "Học viên Makeup Artist",
    level: "Học viên xuất sắc",
    verified: false,
    avatarId: "photo-1494790108377-be9c29b29330",
    coverImageId: "photo-1679141335462-547b83aa99f5",
    area: "Quận 1, TP.HCM",
    phone: "0904561245",
    zaloPhone: "0904561245",
    instagram: "trinh_beauty",
    rating: 4.8,
    reviewCount: 14,
    completedPostsCount: 19,
    bio: "Học viên khóa chuyên nghiệp tại Học viện Makeup TP.HCM. Cần tìm mẫu thực hành các layout thi tốt nghiệp. Hỗ trợ chụp ảnh và mỹ phẩm cao cấp 100%.",
    specialties: ["Layout Cô dâu Thái", "Tone Cam Đào", "Kỷ yếu tự nhiên"],
    portfolio: [
      { id: "n1", title: "Makeup Thi Tốt Nghiệp", category: "Makeup", imageId: "photo-1679141335462-547b83aa99f5", likes: 142 },
      { id: "n2", title: "Tone Cam Nude Trong Trẻo", category: "Makeup", imageId: "photo-1512496015851-a90fb38ba796", likes: 118 },
    ],
    reviews: [
      {
        id: "rn1",
        authorName: "Thanh Trúc",
        authorAvatarId: "photo-1580489944761-15a19d654956",
        role: "Mẫu ảnh thực hành",
        rating: 5,
        date: "5 ngày trước",
        comment: "Bạn Trinh rất dễ thương, đúng giờ, chuẩn bị đồ kỹ lưỡng. Makeup xong được bạn chụp cho chục tấm ảnh đẹp mang về.",
        tag: "Thực hành cô dâu",
      },
    ],
  },
};
