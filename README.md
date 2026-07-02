# S-Light Tower — Landing Page Bất Động Sản

Landing page thương mại giới thiệu dự án **S-Light Tower** (Sun Group) — tòa tháp căn hộ hạng sang mặt sông Hàn, Đà Nẵng. Website tĩnh 100% (HTML5 + CSS3 + Vanilla JS ES6), sẵn sàng deploy lên GitHub Pages.

## ✅ Chức năng đã hoàn thành

1. **Loading screen** — logo dự án, animation, tự ẩn (tối đa 2s)
2. **Sticky header** — blur khi cuộn, scroll-spy active menu, mobile hamburger + overlay
3. **Hero slider** — 3 ảnh, autoplay 6s, pause hover, swipe mobile, dots + prev/next, form đăng ký bên phải
4. **Tổng quan dự án** — bảng thông số đầy đủ + counter animation (792 căn, 22 tầng, 270°, 3 mặt sông)
5. **8 điểm nổi bật** — card hover animation
6. **Vị trí** — ảnh 3 mặt giáp sông (lightbox) + kết nối + hạ tầng tương lai (công viên ven sông, cầu Bùi Tá Hán, DIFF Complex)
7. **Tiện ích** — nội khu (bể bơi, gym, kid club, sân vườn tầng 3, shop đế 7m, 3 hầm xe) & ngoại khu
8. **Mặt bằng** — 5 layout với filter theo loại căn (Studio/1BR/2BR/3BR), lightbox zoom
9. **Thiết kế căn hộ** — bảng diện tích + tiêu chuẩn bàn giao (trần thạch cao, tường sơn, sàn gạch vân gỗ)
10. **Bảng giá & ưu đãi** — gói nội thất 140–450 triệu theo loại căn (giá bán: CĐT chưa công bố → CTA nhận giá)
11. **Chính sách bán hàng** — booking 50 triệu, early bird 3%, hoàn 100%, ưu tiên chọn căn
12. **Ngân hàng hỗ trợ** — BIDV, VCB, VietinBank, MB, NCB, VPBank
13. **Tiến độ** — timeline: booking → ký HĐMB 30/10/2026 → xây 18 tháng → bàn giao 6/2028
14. **Thư viện ảnh** — masonry, lazy loading, lightbox fullscreen/keyboard/swipe
15. **FAQ** — accordion + FAQ Schema JSON-LD
16. **Form đăng ký cuối trang** — nền ảnh pháo hoa parallax
17. **Footer** — hotline, Zalo, địa chỉ, menu
18. **Popup form + Toast + nút nổi** (Gọi / Zalo / Back-to-top)

## 🔌 Form API

Tất cả form (Hero, Popup, Cuối trang) dùng chung 1 handler:

- **Endpoint:** `https://script.google.com/macros/s/AKfycbxRY0aLy3eGmjiCM5GgG1UwLm7RDcYhalrJdxQKre1CNTW5lRN0MMYEqii30xlrrUnR/exec`
- **Method:** POST, JSON `{fullName, phone, email, need, source: "Landing Page", userAgent}`
- **Lưu ý:** dùng `mode: 'no-cors'` vì Google Apps Script không trả CORS headers cho fetch từ browser (response opaque = đã gửi thành công)
- Validation: họ tên bắt buộc, SĐT Việt Nam (regex `^(0|\+84)(3|5|7|8|9)\d{8}$`), email optional nhưng phải đúng định dạng
- Trạng thái "Đang gửi...", khóa nút, toast thành công/thất bại, không reload/redirect

## 📁 Cấu trúc

```
index.html          — trang chính (18 section, SEO đầy đủ, JSON-LD ×2)
css/style.css       — toàn bộ style, mobile-first responsive
js/main.js          — slider, lightbox, popup, scroll-spy, counter, filter, form
images/             — 11 ảnh dự án (hero, vị trí, nội thất, 5 mặt bằng...)
robots.txt / sitemap.xml / manifest.json
```

## 🌐 URI chức năng

- `/index.html` — landing page (one-page, anchor: `#overview-section`, `#location-section`, `#amenities-section`, `#floorplan-section`, `#pricing-section`, `#policy-section`, `#faq-section`, `#register-section`, `#contact-section`)

## 📞 Thông tin liên hệ trong site

- Hotline/Zalo: **0372 165 731** (Lê Văn Chương) — https://zalo.me/0372165731
- Địa chỉ: 168 Xô Viết Nghệ Tĩnh, Hòa Cường, Đà Nẵng

## ⚠️ Chưa có / cần cập nhật sau

- **Giá bán từng căn** (tài liệu ghi "xxx" — chưa công bố) → hiện dùng CTA "Nhận giá gốc CĐT"
- Video dự án (chưa được cung cấp → section video ẩn theo spec)
- Logo ngân hàng chính thức (hiện dùng badge chữ viết tắt màu thương hiệu)
- Domain thật: thay `slight-tower.example.com` trong `index.html` (canonical/OG), `robots.txt`, `sitemap.xml`

## 🚀 Deploy

Để đưa website lên mạng, dùng **Publish tab** (hoặc upload toàn bộ repo lên GitHub Pages — chạy ngay, không cần build).
