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

## Yêu cầu nâng cấp ERP đa phân hệ

- [ ] Đánh giá khả năng chịu tải 200.000+ dòng và hơn 50 người dùng đồng thời
- [ ] Bổ sung phân hệ Sản xuất, Kho bãi, Bán hàng, KCS/QC, Nhân sự và Thu chi
- [x] Thiết kế lớp metadata Zero-Trust ứng dụng với device ID, IP, user-agent và nhật ký request
- [ ] Bổ sung tường lửa IP, giới hạn mạng công ty và chế độ chỉ xem ngoài công ty
- [x] Bổ sung RLS theo người tạo và vai trò nghiệp vụ ở các danh sách/mutation chính
- [x] Bổ sung workflow task và callback nhắc việc idempotent; bước tạo lịch Heartbeat sẽ thực hiện sau khi deploy
- [x] Bổ sung audit trail với oldValue/newValue, IP, device và user-agent cho các thay đổi chính
- [ ] Bổ sung optimistic UI có rollback khi mutation thất bại
- [ ] Bổ sung Cross-Sheet Popup và liên kết bản ghi giữa các phân hệ
- [ ] Bổ sung POS, tính tiền, sinh VietQR động và in bill
- [ ] Bổ sung JSON Grid cho dữ liệu quan hệ 1-Nhiều của Lab/QC
- [x] Bổ sung QC record với đánh giá pass/fail theo ngưỡng Min/Max
- [ ] Bổ sung dropdown liên hoàn theo địa giới và danh mục phụ thuộc
- [x] Bổ sung batch insert nguyên liệu tối đa 500 dòng mỗi request và audit batch
- [ ] Bổ sung tính toán client-side và virtualized grid cho dữ liệu lớn
- [ ] Bổ sung auto-clean tệp mồ côi theo lịch định kỳ
- [ ] Bổ sung cơ chế reset ID O(1) an toàn và nhật ký thao tác
- [ ] Bổ sung Smart UI nhận diện từ khóa để gán icon và nhóm menu
- [ ] Kiểm thử tải, bảo mật, responsive và hiệu năng trên PC/mobile
- [ ] Cập nhật tài liệu giới hạn vận hành, cấu hình và lộ trình triển khai

## Quyết định kiến trúc phương án A

- [x] Tối ưu truy vấn phân trang cursor cho dữ liệu lớn trong hosting quản lý hiện tại
- [ ] Thiết kế lớp bảo mật ứng dụng Zero-Trust không phụ thuộc agent hệ điều hành
- [x] Tạo schema chính sách IP với mặc định ngoài mạng công ty là chỉ xem; chưa bật enforcement khi chưa có dải IP thực tế
- [x] Triển khai RLS ứng dụng, audit trail theo trường và metadata IP/device trong giới hạn database hiện tại
- [x] Triển khai callback Heartbeat idempotent cho workflow nhắc việc; auto-clean tệp vẫn cần tích hợp storage listing riêng
- [x] Ghi rõ giới hạn phương án A: không cam kết fingerprint phần cứng tuyệt đối, firewall hệ điều hành hoặc thông lượng 50 user trong mọi điều kiện

## Khoảng cần sửa trước checkpoint nâng cấp

- [x] Sửa QC record để lấy chuẩn theo batch và beerType tương ứng; logic đã tách ngưỡng theo từng loại bia
- [x] Nối cursor pagination vào UI Kho nguyên liệu và áp dụng owner filter ở backend
- [x] Enforce ownership cho mutation kho, sản xuất, khách hàng, đơn hàng và ghi audit oldValue/newValue ở các thao tác chính

## Khoảng còn lại trước checkpoint tiếp theo

- [x] Hoàn thiện ownership và audit cho beerTypes.update/delete, recipes.update/delete, sales.create và mutation còn thiếu
- [x] Hoàn thiện UI phân trang Kho bằng nextCursor và thao tác tải trang tiếp theo
- [x] Bổ sung test QC nhiều loại bia dùng cùng fieldKey và threshold độc lập

## Test hồi quy QC theo lô

- [x] Bổ sung test helper QC xác nhận cùng fieldKey nhưng khác beerTypeId lấy đúng Min/Max theo batch
- [x] Bổ sung test hồi quy hai lô khác loại bia, một giá trị pass ở bia A nhưng fail ở bia B

## Kiểm thử đầy đủ luồng QC

- [x] Tách helper đánh giá QC nhận batch, danh sách standard và fieldKey rồi kiểm thử đầy đủ luồng batchId → beerTypeId → Min/Max
- [x] Kiểm thử hai batch khác beerType có cùng fieldKey và cùng giá trị nhưng kết quả pass/fail khác nhau
