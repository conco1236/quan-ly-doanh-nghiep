# Project TODO

- [x] Thiết kế dark theme xanh đậm và vàng amber theo phong cách thương hiệu bia
- [x] Dựng DashboardLayout responsive với sidebar tiếng Việt và trạng thái menu đang chọn
- [x] Xây dựng dashboard tổng quan với KPI doanh thu, tồn kho, đơn hàng và trạng thái sản xuất
- [x] Thiết kế schema database cho nguyên liệu, giao dịch kho, loại bia, công thức, lô sản xuất, bước sản xuất, khách hàng, đơn hàng và chi tiết đơn hàng
- [x] Tạo migration database và áp dụng schema bằng quy trình Drizzle
- [x] Thêm API tRPC cho dashboard và các phân hệ nghiệp vụ
- [x] Triển khai CRUD kho nguyên liệu với cảnh báo tồn thấp
- [x] Triển khai nhập kho, xuất kho và lịch sử giao dịch
- [x] Triển khai CRUD danh mục loại bia và công thức nguyên liệu
- [x] Triển khai quản lý lô sản xuất và tiến độ các bước đường hóa, lên men, lọc, đóng chai
- [x] Triển khai CRUD khách hàng và lịch sử mua hàng
- [x] Triển khai tạo và cập nhật đơn hàng với trạng thái mới, đang xử lý, hoàn thành, hủy
- [x] Triển khai quản trị người dùng và phân quyền admin/user
- [x] Khóa trang quản trị và thao tác quản trị cho tài khoản không phải admin
- [x] Bổ sung trạng thái loading, empty, error và thông báo tiếng Việt
- [x] Bổ sung unit tests cho router và các quy tắc nghiệp vụ chính
- [x] Kiểm thử TypeScript, Vitest và responsive trên desktop/mobile
- [x] Chụp screenshot xác minh giao diện và tạo checkpoint bàn giao

## Lịch sử thay đổi

- [x] Người dùng yêu cầu mở rộng từ bản phác thảo ERP thành hệ thống quản lý nhà máy bia toàn diện
- [x] Người dùng yêu cầu bắt buộc dark theme xanh đậm–amber và giao diện hoàn toàn bằng tiếng Việt
- [x] Người dùng yêu cầu phân quyền cứng: trang quản trị chỉ dành cho admin

## Ghi chú dữ liệu

- Không sử dụng dữ liệu đánh giá, testimonial hoặc review giả.
- Dữ liệu nghiệp vụ mẫu nếu cần chỉ dùng để kiểm thử giao diện và phải được đánh dấu rõ là dữ liệu demo.

## Khoảng cần hoàn thiện sau rà soát

- [x] Kết nối các màn hình danh sách nghiệp vụ chính với tRPC thật; các bảng dữ liệu vẫn có fallback demo để duy trì preview khi database chưa có bản ghi
- [x] Hoàn thiện API còn thiếu cho công thức, lô sản xuất, bước nấu, đơn hàng và lịch sử mua hàng khách hàng
- [x] Dùng layout sidebar responsive tùy biến theo cấu trúc DashboardLayout cho trải nghiệm ERP tiếng Việt
- [x] Bổ sung loading, empty, error states cho từng query/mutation nghiệp vụ
- [x] Mở rộng unit tests cho phân quyền, chống số lượng âm, đơn hàng rỗng và lô sản xuất không hợp lệ
- [x] Chụp screenshot responsive trên mobile và xác minh giao diện sau khi kết nối dữ liệu thật

## Khoảng cuối trước bàn giao

- [x] Tạo checkpoint bàn giao sau khi hoàn tất xác minh giao diện
- [x] Bổ sung trạng thái pending/error/success thực cho các mutation tạo nguyên liệu, loại bia và khách hàng

## Hiệu chỉnh UX cuối

- [x] Tích hợp trải nghiệm sidebar responsive tùy biến; ghi nhận đây là kiến trúc riêng thay vì bọc thêm DashboardLayout chuẩn để tránh lồng hai sidebar
- [x] Giữ dialog mở trong lúc mutation pending, chỉ đóng khi thành công và hiển thị lỗi trực tiếp trong form qua callback mutation

## Sửa lỗi mutation dialog

- [x] Chỉ đóng dialog khi mutation thành công; giữ nguyên form khi thất bại
- [x] Hiển thị lỗi mutation trực tiếp trong dialog để người dùng sửa dữ liệu
