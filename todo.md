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

- [x] Đánh giá sơ bộ khả năng chịu tải bằng cursor/virtualized và load-smoke harness; chưa cam kết benchmark production khi chưa có staging load test
- [x] Bổ sung các phân hệ Sản xuất, Kho bãi, Bán hàng, KCS/QC và khung mở rộng Nhân sự/Thu chi; CRUD riêng của hai phân hệ mở rộng nằm trong roadmap
- [x] Thiết kế lớp metadata Zero-Trust ứng dụng với device ID, IP, user-agent và nhật ký request
- [x] Bổ sung CIDR policy helper full/read_only/deny và request-level tRPC enforcement; cần dải IP thật trước khi bật policy production
- [x] Bổ sung RLS theo người tạo và vai trò nghiệp vụ ở các danh sách/mutation chính
- [x] Bổ sung workflow task và callback nhắc việc idempotent; bước tạo lịch Heartbeat sẽ thực hiện sau khi deploy
- [x] Bổ sung audit trail với oldValue/newValue, IP, device và user-agent cho các thay đổi chính
- [x] Bổ sung optimistic UI có rollback khi mutation thất bại trong JSON Grid QC bằng cache tRPC và snapshot rollback
- [x] Bổ sung Cross-Sheet Popup và liên kết bản ghi giữa các phân hệ bằng resolver database
- [x] Bổ sung POS, tính tiền client-side, sinh VietQR động và in bill theo receipt payload
- [x] Bổ sung JSON Grid cho dữ liệu quan hệ 1-Nhiều của Lab/QC và batch insert QC
- [x] Bổ sung QC record với đánh giá pass/fail theo ngưỡng Min/Max
- [x] Bổ sung dropdown liên hoàn theo địa giới và danh mục phụ thuộc trong form khách hàng
- [x] Bổ sung batch insert nguyên liệu tối đa 500 dòng mỗi request và audit batch
- [x] Bổ sung virtualized grid thực tế cho ModuleTable; POS đã tính tiền client-side
- [x] Bổ sung metadata stored_files, helper xóa metadata mồ côi quá hạn và callback Heartbeat storage-cleanup idempotent; chưa tạo lịch vì site cần deploy trước
- [x] Bổ sung ID strategy O(1) dùng auto-increment, không renumber khóa lịch sử, kèm audit policy
- [x] Bổ sung Smart UI nhận diện từ khóa để gán icon và nhóm menu bằng helper metadata
- [x] Tạo load-smoke harness 200.000 dòng/50 user cho cursor/virtualized; benchmark production thực tế vẫn cần staging database
- [x] Cập nhật tài liệu giới hạn vận hành, cấu hình và lộ trình triển khai

## Quyết định kiến trúc phương án A

- [x] Tối ưu truy vấn phân trang cursor cho dữ liệu lớn trong hosting quản lý hiện tại
- [x] Thiết kế lớp bảo mật ứng dụng Zero-Trust không phụ thuộc agent hệ điều hành; device ID là định danh ứng dụng, không cam kết fingerprint phần cứng tuyệt đối
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

## Phase 4: workflow, QC, POS và giao diện liên kết

- [x] Thêm POS quote, VietQR URL động và tích hợp receipt payload vào màn hình in bill riêng
- [x] Thêm JSON Grid cho kết quả QC 1-Nhiều với cập nhật optimistic cache và rollback
- [x] Thêm Cross-Sheet Popup cho bản ghi liên quan giữa Kho, Sản xuất, Bán hàng và Khách hàng
- [x] Thêm dropdown phụ thuộc cho dữ liệu địa chỉ khách hàng

## Hiệu chỉnh phase 4 trước checkpoint

- [x] Tích hợp sales.receipt vào UI POS và in mẫu bill riêng thay vì in toàn trang
- [x] Chuyển tính tiền POS sang client-side và chỉ dùng server khi lưu/truy vết
- [x] Cập nhật optimistic danh sách QC ngay khi gửi, rollback cache/list khi lỗi
- [x] Triển khai virtualized grid thực tế cho bảng dữ liệu lớn bằng vùng cuộn và chỉ render các dòng nhìn thấy

## Phase 4 còn lại

- [x] Thêm Cross-Sheet Popup có liên kết bản ghi nguồn và trường dữ liệu liên quan
- [x] Thêm dropdown phụ thuộc cho Tỉnh → Huyện trong hồ sơ khách hàng

## Hoàn thiện Cross-Sheet thực sự

- [x] Thêm resolver liên kết chéo theo customerId, orderId, batchId, beerTypeId và inventory transaction
- [x] Hiển thị danh sách bản ghi liên quan theo nhóm trong popup và truy vấn từ procedure crossSheet
- [x] Viết test mapping xác nhận khóa chéo trả đúng nhóm bảng liên quan

## Bổ sung resolver Cross-Sheet

- [x] Mở rộng getCrossSheetLinks cho salesOrderItems theo orderId và nhánh beer_types theo beerTypeId
- [x] Bổ sung test mapping resolver cho đơn hàng, loại bia, lô và nguyên liệu theo nhóm khóa liên kết

## Bổ sung test resolver Cross-Sheet

- [x] Thêm assertion mapping cho beer_types và ingredients
- [x] Kiểm thử getCrossSheetLinks theo tableName + recordId trong trạng thái database chưa sẵn sàng

## Nâng cấp dropdown địa giới production

- [x] Tách danh mục Tỉnh/Huyện thành cấu trúc cấu hình dùng chung, không khai báo trực tiếp trong ModuleTable
- [x] Bổ sung provinceCode/districtCode vào schema khách hàng và migration an toàn
- [x] Áp dụng dropdown phụ thuộc cho form tạo mới khách hàng; chỉnh sửa hồ sơ đầy đủ vẫn là hạng mục tiếp theo
- [x] Bổ sung test chọn Tỉnh đổi danh sách Huyện và mã địa chỉ ổn định

## Kiểm thử dropdown khách hàng

- [x] Tách helper chuyển lựa chọn Tỉnh/Huyện thành payload để test độc lập
- [x] Kiểm thử đổi Tỉnh reset Huyện hợp lệ và payload lưu đúng mã tỉnh/huyện/địa chỉ

## Bổ sung test luồng form khách hàng

- [x] Tách helper reset Huyện khi đổi Tỉnh và assertion getDefaultDistrictName trong test
- [x] Tách helper tạo input mutation khách hàng và assertion buildCustomerCreatePayload đủ provinceCode, districtCode, address

## Hoàn thiện Smart UI và tài liệu bàn giao

- [x] Tích hợp inferSmartUiMeta vào sidebar menu thực tế bằng data-smart-group/data-smart-icon
- [x] Bổ sung test Smart UI metadata và decorateNavItems cho cấu hình render sidebar
- [x] Mở rộng operations.md với cấu hình, bật IP policy/Heartbeat và roadmap triển khai

## Test cấu hình Smart UI sidebar

- [x] Tách helper decorateNavItems dùng inferSmartUiMeta cho cấu hình menu
- [x] Kiểm thử item Kho/Sản xuất/QC có smart group và icon đúng trước khi render

## Phase cuối phương án A

- [x] Thêm khung menu và màn hình Nhân sự/Thu chi để mở rộng theo schema riêng
- [x] Tạo load-smoke harness phân trang/virtualized cho benchmark 200.000 dòng và 50 user
- [x] Tạo helper ID strategy O(1) không renumber khóa lịch sử
- [x] Tạo abstraction auto-clean idempotent dựa trên metadata stored_files và callback scheduled, chưa tạo lịch nếu chưa deploy
- [x] Gắn request guard read_only/deny ở protectedProcedure; cấu hình CIDR thật là bước vận hành sau deploy

## Các khoảng production cần xử lý thật trước checkpoint cuối

- [x] Tạo request guard đọc access_policies từ DB và thực thi full/read_only/deny cho query/mutation
- [x] Tích hợp metadata tệp, metadata cleanup và Heartbeat callback auto-clean idempotent; storage layer không expose delete object nên xóa metadata là cơ chế vô hiệu hóa truy cập
- [x] Xác định roadmap schema/API/CRUD riêng cho Nhân sự và Thu chi; checkpoint hiện tại cung cấp khung module thay vì giả lập CRUD
- [x] Tạo và chạy load-smoke harness mục tiêu 200.000+ dòng/50 user; load test thật trên staging DB/API vẫn là điều kiện production riêng
- [x] Đổi mục reset ID thành chiến lược auto-increment O(1), audit thao tác và ghi rõ không renumber lịch sử

## Hiệu chỉnh cuối trước checkpoint

- [x] Áp dụng access guard cho protectedProcedure/adminProcedure; public procedure được rà soát, các endpoint dữ liệu nhạy cảm dùng protected procedure
- [x] Tích hợp ghi stored_files vào storagePut và test cleanup selector metadata mồ côi idempotent
- [x] Đổi mục reset ID thành tài liệu chiến lược auto-increment/audit, không mô tả như tính năng repair ID

## Test cuối cho access và storage

- [x] Tách helper procedure guard có context mode và test mutation protected/admin bị chặn đúng
- [x] Tách helper record stored file metadata để test storagePut tạo metadata sau upload thành công
- [x] Tách helper cleanup metadata và test selector chạy lặp idempotent không chọn bản ghi đã tham chiếu

## Integration tests cuối cùng

- [x] Test procedure admin query deny và protected mutation deny/read_only; không có admin mutation nghiệp vụ riêng trong router hiện tại
- [x] Mock fetch của storagePut và test DB insert contract để xác nhận upload thành công ghi stored_files metadata
- [x] Test cleanupStoredFileMetadata chạy hai lần, bỏ qua referenced và không xóa lặp

## Điều chỉnh phạm vi kiểm thử trước checkpoint

- [x] Đổi mô tả admin guard thành admin query + protected mutation vì hiện chưa có admin mutation nghiệp vụ
- [x] Tách helper persistStoredFileMetadata dùng DB mặc định để test insert stored_files không cần upload thật
- [x] Tách helper cleanupStoredFileMetadata nhận delete function để test idempotent implementation thay vì chỉ test selector

## Báo cáo thống kê Sản xuất và Kho bãi

- [x] Thiết kế API thống kê sản xuất theo trạng thái, công đoạn và ngày tạo lô
- [x] Thiết kế API thống kê kho theo tồn hiện tại, ngưỡng cảnh báo và giao dịch nhập/xuất
- [x] Thêm bộ lọc khoảng thời gian và phân hệ cho màn hình báo cáo
- [x] Thêm biểu đồ trực quan cho sản xuất và kho bãi bằng dữ liệu database thật
- [x] Thêm trạng thái loading, empty, error và responsive cho báo cáo
- [x] Bổ sung unit tests cho phép tổng hợp dữ liệu báo cáo
- [x] Kiểm tra TypeScript, Vitest, build và screenshot giao diện báo cáo
- [x] Bổ sung thống kê sản xuất theo công đoạn từ production_steps và hiển thị trên báo cáo
- [x] Thêm bộ lọc phân hệ Tất cả / Sản xuất / Kho bãi và áp dụng điều kiện tải/hiển thị
- [x] Bổ sung test byStatus/byDay sản xuất và totalStock/lowStockCount/movementsByDay kho
- [x] Áp dụng bộ lọc phân hệ cho toàn bộ KPI đầu trang

## Phân hệ Nhân sự CRUD

- [x] Thiết kế bảng employees với mã nhân viên, hồ sơ liên hệ, phòng ban, chức danh, trạng thái và ngày vào làm
- [x] Tạo migration employees và áp dụng schema vào database
- [x] Thêm helper database và API tRPC CRUD Nhân sự với owner/RLS và audit oldValue/newValue
- [x] Tích hợp màn hình Nhân sự tiếng Việt: danh sách, tìm kiếm, tạo mới, chỉnh sửa, khóa/nghỉ việc và chi tiết
- [x] Bổ sung validation, loading/empty/error states và responsive cho Nhân sự
- [x] Viết unit/integration tests cho validation, quyền sở hữu và CRUD Nhân sự
- [x] Kiểm tra TypeScript, Vitest, build và screenshot trước checkpoint

## Module Chấm công và Ngày phép

- [x] Thiết kế bảng attendance_records và leave_requests liên kết employees
- [x] Tạo migration database cho chấm công và ngày phép
- [x] Thêm helper database và API tRPC cho chấm công, đơn nghỉ phép và duyệt nghỉ phép
- [x] Tích hợp giao diện chấm công theo ngày và quản lý ngày phép theo nhân viên
- [x] Bổ sung owner/RLS, access mode và audit cho các thao tác nhạy cảm
- [x] Thêm validation, loading/empty/error states và responsive
- [x] Viết unit/integration tests cho ngày công, trùng bản ghi và quy trình duyệt nghỉ
- [x] Kiểm tra TypeScript, Vitest, build và screenshot trước checkpoint

## Xuất báo cáo Chấm công và Ngày phép

- [x] Thiết kế cột và bộ lọc dữ liệu xuất cho bảng chấm công/lịch sử nghỉ phép
- [x] Thêm helper tạo CSV có BOM tiếng Việt và workbook Excel-compatible
- [x] Tích hợp nút xuất CSV/XLS theo tab Chấm công/Ngày phép
- [x] Bổ sung trạng thái rỗng, thông báo lỗi và tên file theo thời gian xuất
- [x] Viết test cho mapping cột, escape CSV và dữ liệu ngày phép
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## XLSX native nhiều sheet

- [x] Thêm thư viện XLSX native phù hợp cho client
- [x] Tạo workbook XLSX với sheet Chấm công và sheet Ngày phép
- [x] Nâng cấp nút xuất Excel sang .xlsx và giữ CSV độc lập
- [x] Bổ sung test workbook có nhiều sheet, tiêu đề tiếng Việt và dữ liệu rỗng
- [x] Kiểm tra dependency, TypeScript, Vitest, build và responsive trước checkpoint

## Sheet tổng hợp Nhân viên - Tháng

- [x] Thiết kế chỉ số tổng hợp ngày công theo trạng thái và ngày phép theo loại
- [x] Tạo helper tổng hợp theo employeeId và tháng từ dữ liệu chấm công/nghỉ phép
- [x] Thêm sheet Tổng hợp vào workbook XLSX native
- [x] Bổ sung test nhóm dữ liệu nhiều nhân viên/tháng và trường hợp rỗng
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Định dạng XLSX báo cáo HR

- [x] In đậm và tô màu hàng tiêu đề, cố định hàng đầu mỗi sheet
- [x] Tự động căn chỉnh độ rộng cột theo nội dung với giới hạn hợp lý
- [x] Định dạng ngày, số ngày và số giờ theo kiểu Excel phù hợp
- [x] Bổ sung test kiểm tra style, width, freeze pane và number format
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Dòng Tổng cộng trong XLSX

- [x] Thêm dòng Tổng cộng cuối sheet Chấm công và Ngày phép
- [x] Thêm dòng Tổng cộng cuối sheet Tổng hợp nhân viên-tháng
- [x] Dùng công thức SUM/COUNTA native cho các cột số và định dạng nổi bật dòng tổng
- [x] Bổ sung test công thức, số dòng và style dòng Tổng cộng
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Nhóm và Subtotal theo Phòng ban

- [x] Bổ sung phòng ban vào dữ liệu tổng hợp nhân viên-tháng
- [x] Nhóm các dòng sheet Tổng hợp theo phòng ban và chèn subtotal sau từng nhóm
- [x] Dùng công thức SUM native cho subtotal và vẫn giữ Tổng cộng cuối sheet
- [x] Bổ sung test nhóm phòng ban, subtotal và trường hợp không có phòng ban
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Biểu đồ XLSX theo Phòng ban

- [x] Tạo dữ liệu tỷ lệ ngày công và ngày nghỉ phép theo phòng ban
- [x] Tạo sheet dữ liệu biểu đồ và chèn biểu đồ thanh bằng công thức native vào workbook
- [x] Tích hợp sheet biểu đồ vào nút xuất XLSX HR
- [x] Bổ sung test dữ liệu biểu đồ, series và sheet khi dữ liệu rỗng
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Lọc phòng ban trước khi xuất XLSX

- [x] Tạo danh sách phòng ban duy nhất và tùy chọn Tất cả phòng ban
- [x] Thêm state chọn nhiều phòng ban và lọc chấm công/nghỉ phép/nhân viên
- [x] Áp dụng dữ liệu đã lọc cho sheet Tổng hợp và Bieu do
- [x] Hiển thị số phòng ban và trạng thái bộ lọc trước khi xuất
- [x] Bổ sung test lọc phòng ban, chọn Tất cả và dữ liệu rỗng
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Preset bộ lọc phòng ban

- [x] Định nghĩa ánh xạ preset Khối văn phòng và Khối sản xuất theo tên phòng ban
- [x] Thêm state preset và cho phép chuyển về tùy chỉnh thủ công
- [x] Hiển thị nút preset cùng trạng thái đang áp dụng trong giao diện
- [x] Bổ sung test ánh xạ preset, preset không có dữ liệu và chọn Tất cả
- [x] Kiểm tra TypeScript, Vitest, build và responsive trước checkpoint

## Trạng thái xuất Excel

- [x] Thêm trạng thái đang tạo và đang tải file Excel
- [x] Khóa nút xuất để chống thao tác trùng trong lúc xử lý
- [x] Hiển thị thông báo thành công kèm phạm vi và số dòng đã xuất
- [x] Hiển thị thông báo thất bại thân thiện khi tạo hoặc tải file lỗi
- [x] Bổ sung test trạng thái xuất và kiểm tra TypeScript/build/responsive

## Mở rộng quản trị doanh nghiệp

- [x] Thiết kế mô hình dữ liệu liên module và ma trận quyền nghiệp vụ
- [x] Triển khai Thu–Chi, Công nợ và đối soát POS
- [x] Triển khai Mua hàng và quản lý Nhà cung cấp
- [x] Triển khai Định mức, Giá vốn và hiệu quả sản xuất
- [x] Triển khai Bảo trì thiết bị và lịch sử sự cố
- [x] Nâng cấp Chấm công, bảng công tháng và phê duyệt
- [x] Mở rộng Workflow, thông báo và Dashboard điều hành
- [x] Hoàn thiện backup, giám sát, hiệu năng và kiểm thử tích hợp
- [x] Kiểm tra toàn hệ thống và lưu checkpoint bàn giao theo giai đoạn

### Thu–Chi và Công nợ

- [x] Tạo bảng phiếu thu/chi và danh mục tài khoản quỹ
- [x] Tạo bảng công nợ phải thu/phải trả và đối soát đơn POS
- [x] Thêm API tRPC list/create/update/settle với owner, access mode và audit
- [x] Thay placeholder Thu chi bằng giao diện sổ quỹ, bộ lọc và form nghiệp vụ
- [x] Bổ sung test validation, quyền và tổng hợp số dư tài chính

### Mua hàng và Nhà cung cấp

- [x] Tạo bảng nhà cung cấp, đơn mua và chi tiết đơn mua
- [x] Thêm API tRPC danh sách/tạo/cập nhật trạng thái đơn mua
- [x] Tích hợp nhận hàng vào tồn kho và audit số lượng
- [x] Thay khung mở rộng bằng giao diện Mua hàng/Nhà cung cấp
- [x] Bổ sung test validation, quyền và tổng hợp đơn mua

### Định mức và Giá vốn

- [x] Tạo helper tính giá vốn công thức từ định mức nguyên liệu và đơn giá nhập gần nhất
- [x] Tạo báo cáo giá vốn theo lô sản xuất và sản lượng thực tế
- [x] Thêm API reports.costing và KPI biên lợi nhuận cơ bản
- [x] Hiển thị khu vực Giá vốn trong báo cáo điều hành
- [x] Bổ sung test tính giá vốn, hao hụt và dữ liệu thiếu đơn giá

### Bảo trì thiết bị

- [x] Tạo bảng thiết bị, lịch bảo dưỡng và phiếu sự cố
- [x] Thêm API tRPC tạo/cập nhật trạng thái/lịch sử chi phí bảo trì
- [x] Tích hợp cảnh báo thiết bị quá hạn bảo dưỡng
- [x] Thay khung mở rộng bằng giao diện Bảo trì
- [x] Bổ sung test lịch hạn, trạng thái và quyền sở hữu

### Chấm công nâng cao

- [x] Thêm helper tổng hợp bảng công theo nhân viên và tháng
- [x] Thêm API monthlySummary và danh sách đơn chờ duyệt cho quản trị
- [x] Hiển thị KPI bảng công tháng và cảnh báo đơn nghỉ chờ duyệt
- [x] Bổ sung test tổng hợp ngày công theo tháng và quyền duyệt


## Xuất báo cáo POS và HR dạng Excel/PDF

- [x] Tạo helper dữ liệu và workbook đối soát doanh thu POS
- [x] Tạo helper workbook bảng công HR theo tháng và phạm vi phòng ban
- [x] Thêm xuất PDF báo cáo POS và HR với bố cục in được
- [x] Tích hợp nút Excel/PDF, trạng thái loading/thành công/thất bại vào Finance và HR
- [x] Bổ sung test dữ liệu, công thức/tổng hợp và tên file xuất
- [x] Chạy full test, TypeScript, build, responsive và lưu checkpoint


## Logo và chữ ký trong PDF

- [x] Bổ sung logo vector BreweryOS vào header PDF
- [x] Bổ sung thông tin người phê duyệt, chức danh và khu vực ký cuối PDF
- [x] Truyền metadata phê duyệt cho báo cáo POS và HR
- [x] Bổ sung test helper PDF metadata và chạy full validation


## Logo công ty tùy chỉnh

- [x] Tạo metadata lưu logo công ty và quyền owner/admin
- [x] Thêm API upload/reset logo dùng S3 storage, kiểm tra MIME và kích thước
- [x] Hiển thị logo tùy chỉnh trong PDF POS và HR, fallback logo mặc định
- [x] Thêm giao diện tải lên/xem trước/xóa logo trong cài đặt
- [x] Bổ sung test upload, quyền, validation và PDF logo
- [x] Chạy full test, TypeScript, build và lưu checkpoint


## Chỉnh sửa tên công ty và slogan

- [x] Thêm API admin lưu companyName và tagline với audit oldValue/newValue
- [x] Thêm form chỉnh sửa tên công ty và slogan trong BrandingPanel
- [x] Hiển thị preview thương hiệu và trạng thái lưu thành công/thất bại
- [x] Bổ sung test validation/quyền và chạy full validation


## Xem trước PDF trong quản lý thương hiệu

- [x] Tạo helper sinh Blob URL PDF preview từ branding và dữ liệu mẫu POS/HR
- [x] Thêm tab chọn báo cáo POS/HR và iframe xem trước trong BrandingPanel
- [x] Đồng bộ logo, tên công ty, slogan và người phê duyệt vào preview
- [x] Thêm xử lý loading/lỗi và thu hồi Blob URL khi thay đổi
- [x] Bổ sung test helper preview và chạy full validation


## Đổi tên ứng dụng

- [x] Cập nhật VITE_APP_TITLE thành Quản Lý Doanh Nghiệp
- [x] Cập nhật title/meta và thương hiệu hiển thị trong giao diện
- [x] Rà soát tên cũ trong các vị trí chính và chạy validation


## Đồng bộ tên trên sidebar và logo

- [x] Cập nhật chữ thương hiệu trong sidebar thành Quản Lý Doanh Nghiệp
- [x] Đồng bộ khu vực logo/header và văn bản thay thế
- [x] Giữ responsive desktop/mobile và chạy validation


## Đồng bộ hóa đơn POS

- [x] Rà soát và loại bỏ từ khóa thương hiệu cũ khỏi mẫu hóa đơn POS
- [x] Hiển thị Quản Lý Doanh Nghiệp trong tiêu đề và chân hóa đơn
- [x] Cập nhật nội dung chuyển khoản/thanh toán liên quan nếu còn tên cũ
- [x] Bổ sung test hóa đơn và chạy full validation


## Thông tin liên hệ trên hóa đơn POS

- [x] Thêm địa chỉ, hotline và mã số thuế vào metadata branding
- [x] Mở rộng API và form cấu hình thương hiệu cho thông tin liên hệ
- [x] Hiển thị thông tin liên hệ trong hóa đơn POS và QR thanh toán nếu phù hợp
- [x] Bổ sung test validation/hóa đơn và chạy full validation


## Email và website trên hóa đơn POS

- [x] Thêm email và website vào metadata branding
- [x] Mở rộng API, validation và form cấu hình thương hiệu
- [x] Hiển thị email và website trên hóa đơn POS
- [x] Bổ sung test và chạy full validation


## Đồng bộ GitHub

- [x] Kiểm tra trạng thái Git và repository hiện tại
- [x] Tạo repository GitHub riêng tư cho dự án
- [x] Commit và push mã nguồn lên GitHub
- [x] Xác minh remote và đường dẫn repository


## README hướng dẫn dự án

- [x] Viết README tiếng Việt với tổng quan kiến trúc và module
- [x] Hướng dẫn cài đặt, chạy development/production và migration database
- [x] Tài liệu biến môi trường, branding, storage và bảo mật
- [x] Hướng dẫn test, build, GitHub workflow và troubleshooting
- [x] Rà soát, commit và push README lên GitHub


## Phân quyền Cấu hình thương hiệu

- [x] Rà soát policy Admin/Nhân viên ở API branding và điều hướng
- [x] Khóa mọi thao tác đọc/ghi branding không phù hợp với vai trò
- [x] Hiển thị trạng thái quyền và màn hình từ chối truy cập cho Nhân viên
- [x] Bổ sung test Admin/Nhân viên và chạy full validation


## Quản lý người dùng và vai trò

- [x] Rà soát bảng users và API quản trị hiện có
- [x] Thêm API danh sách người dùng, tìm kiếm và cập nhật role
- [x] Bảo vệ API chỉ cho Admin và ghi audit thay đổi role
- [x] Xây dựng giao diện quản lý người dùng với role selector và trạng thái
- [x] Bổ sung test RBAC, cập nhật role và chạy full validation


## Khóa và mở khóa tài khoản

- [x] Thêm trạng thái account active/locked vào bảng users
- [x] Chặn đăng nhập và phiên bị khóa ở server
- [x] Thêm API Admin khóa/mở khóa, audit và bảo vệ Admin cuối cùng
- [x] Hiển thị thao tác và trạng thái tài khoản trong AdminUsersPanel
- [x] Bổ sung test auth/RBAC và chạy full validation

## Rà soát và ổn định ứng dụng

- [x] Chạy lại test, TypeScript, build và rà soát log runtime
- [x] Kiểm tra các luồng RBAC, khóa tài khoản và thao tác quản trị
- [x] Kiểm tra giao diện desktop/mobile của các màn hình trọng yếu
- [x] Sửa lỗi có thể tái hiện và bổ sung test hồi quy
- [x] Lưu checkpoint ổn định sau xác minh

## Tối ưu lazy load xuất PDF/XLSX

- [x] Khảo sát dependency và kích thước bundle xuất file hiện tại
- [x] Lazy load thư viện PDF/XLSX theo thao tác người dùng
- [x] Cập nhật luồng xuất và xem trước PDF để chờ mô-đun bất đồng bộ
- [x] Bổ sung test hồi quy và xác minh giảm bundle ban đầu
- [x] Lưu checkpoint tối ưu hiệu suất

## Tối ưu lazy load html2canvas và báo cáo

- [x] Phân tích html2canvas và module báo cáo còn trong bundle khởi tạo
- [x] Lazy load html2canvas theo thao tác cần render ảnh
- [x] Tách module báo cáo ít dùng khỏi dashboard chính
- [x] Bổ sung test hồi quy và đo lại bundle khởi tạo
- [x] Lưu checkpoint tối ưu tiếp theo

## Manual chunks biểu đồ và UI quản trị

- [x] Phân tích dependency biểu đồ/UI và asset graph production
- [x] Cấu hình manual chunks phù hợp trong Vite
- [x] Bổ sung regression test và kiểm tra tải dashboard
- [x] Đo bundle/chunk sau tối ưu
- [x] Lưu checkpoint tối ưu build

## Tách chunk quản trị

- [x] Khảo sát phụ thuộc AdminUsersPanel và BrandingPanel
- [x] Tách AdminUsersPanel thành mô-đun lazy-load
- [x] Tách BrandingPanel thành mô-đun lazy-load
- [x] Bổ sung test hồi quy, xác minh RBAC/PDF và đo bundle
- [x] Lưu checkpoint tách chunk quản trị
