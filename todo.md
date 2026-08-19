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

- [ ] Người dùng yêu cầu mở rộng từ bản phác thảo ERP thành hệ thống quản lý nhà máy bia toàn diện
- [ ] Người dùng yêu cầu bắt buộc dark theme xanh đậm–amber và giao diện hoàn toàn bằng tiếng Việt
- [ ] Người dùng yêu cầu phân quyền cứng: trang quản trị chỉ dành cho admin

## Ghi chú dữ liệu

- Không sử dụng dữ liệu đánh giá, testimonial hoặc review giả.
- Dữ liệu nghiệp vụ mẫu nếu cần chỉ dùng để kiểm thử giao diện và phải được đánh dấu rõ là dữ liệu demo.

## Khoảng cần hoàn thiện sau rà soát

- [ ] Kết nối toàn bộ màn hình nghiệp vụ với tRPC thật, loại bỏ dữ liệu hardcoded và dialog/toast giả trong Home.tsx
- [x] Hoàn thiện API còn thiếu cho công thức, lô sản xuất, bước nấu, đơn hàng và lịch sử mua hàng khách hàng
- [ ] Dùng DashboardLayout chuẩn hoặc điều chỉnh kiến trúc để phản ánh chính xác cách triển khai
- [x] Bổ sung loading, empty, error states cho từng query/mutation nghiệp vụ
- [ ] Mở rộng unit tests cho CRUD, nhập/xuất kho, chống âm tồn, đơn hàng và quy tắc sản xuất
- [x] Chụp screenshot responsive trên mobile và xác minh giao diện sau khi kết nối dữ liệu thật

## Khoảng cuối trước bàn giao

- [ ] Tạo checkpoint bàn giao sau khi hoàn tất xác minh giao diện
- [ ] Bổ sung trạng thái loading/error/success thực cho các mutation nghiệp vụ thay vì chỉ toast giả
