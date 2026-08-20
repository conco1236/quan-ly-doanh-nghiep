# Ghi chú rà soát ứng dụng

## 20-08-2026

Rà soát nền tảng xác nhận 68 bài kiểm thử Vitest, TypeScript và production build đều đạt. Log runtime không có lỗi request 4xx/5xx; chỉ xuất hiện cảnh báo phụ thuộc `stream` từ thư viện tạo PDF, chưa tái hiện lỗi thao tác hay lỗi console trong màn hình đăng nhập.

Đã phát hiện màn hình chưa đăng nhập còn dùng nhãn **BREWERY OS** và nội dung “Quản trị nhà máy bia”, trong khi ứng dụng đã đổi tên thành **Quản Lý Doanh Nghiệp**. Cấu hình `system_branding` hiện có cũng đang giữ giá trị kế thừa `BREWERYOS`; việc đồng bộ nhận diện đang được triển khai với migration an toàn và không ghi đè giá trị tùy chỉnh khác.
