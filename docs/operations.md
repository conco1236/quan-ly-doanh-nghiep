# BreweryOS — Hướng dẫn vận hành và lộ trình phương án A

## 1. Phạm vi hệ thống

BreweryOS là ERP nhà máy bia tiếng Việt, dark theme xanh đậm–amber, gồm Dashboard, Kho nguyên liệu, Danh mục bia, Sản xuất, KCS/QC, POS, Đơn hàng, Khách hàng và Quản trị admin/user. Backend dùng Express/tRPC, schema Drizzle và database MySQL/TiDB. Các phân hệ Nhân sự và Thu chi chưa có CRUD nghiệp vụ riêng trong checkpoint hiện tại.

## 2. Cấu hình cần thiết

| Nhóm | Cấu hình | Ghi chú |
|---|---|---|
| Phiên đăng nhập | `JWT_SECRET`, OAuth envs | Do hệ thống quản lý tự cấp; không ghi vào source |
| Database | `DATABASE_URL` | Migration phải được sinh và rà soát trước khi áp dụng |
| Storage | Built-in storage helpers | Tệp không lưu byte trong database |
| IP policy | Bảng `access_policies.allowedCidrs`, `outsideMode` | Dùng CIDR IPv4; `read_only` là mặc định an toàn |
| Device | Header `x-device-id` | Là định danh ứng dụng; không phải fingerprint phần cứng tuyệt đối |
| Heartbeat | Callback `/api/scheduled/*` + `taskUid` | Phải deploy trước khi tạo lịch |

## 3. Bật chính sách IP

Quản trị viên tạo policy với một hoặc nhiều CIDR mạng công ty, ví dụ `10.10.0.0/16`, chọn `outsideMode = read_only` hoặc `deny`, rồi bật policy. Helper `resolveAccessMode` trả về `full` khi IP khớp CIDR, ngược lại trả về mode ngoài mạng. Không cấu hình CIDR thật khi chưa xác nhận mạng VPN/văn phòng; tránh khóa nhầm toàn bộ người dùng.

## 4. Workflow và Heartbeat

Không dùng `setInterval`, `node-cron` hoặc timer trong tiến trình web. Callback cần bắt đầu bằng `/api/scheduled/`, xác thực cron bằng SDK, tra dòng nghiệp vụ theo `taskUid`, chạy idempotent và trả JSON lỗi khi thất bại. Sau khi callback được checkpoint, người quản trị phải Deploy site rồi mới tạo lịch. Heartbeat là nơi phù hợp cho nhắc việc workflow; auto-clean tệp chỉ được bật khi metadata tệp và quyền listing storage đã được kết nối.

## 5. Hiệu năng và kiểm thử

Cursor pagination giới hạn dữ liệu tải mỗi lần, ModuleTable dùng virtualized renderer và QC/POS có tính toán client-side. Batch insert được giới hạn theo request để kiểm soát RAM. Cần chạy load test với dữ liệu đại diện trước khi cam kết hơn 200.000 dòng hoặc hơn 50 user đồng thời; Autoscale không bảo đảm một worker nền luôn sống và không thay thế queue chuyên dụng.

## 6. Audit, RLS và Zero-Trust

Các mutation chính kiểm tra `createdBy`, ghi `oldValue/newValue`, IP, device ID và user-agent. Device ID trình duyệt không chứng minh phần cứng tuyệt đối; nếu cần định danh phần cứng mạnh phải có MDM/agent bên ngoài phương án A. RLS hiện là application-level RLS, không phải database-native row-level security.

## 7. Roadmap triển khai

| Giai đoạn | Nội dung | Điều kiện hoàn tất |
|---|---|---|
| Đã hoàn tất | Schema nghiệp vụ, RLS/audit, QC theo batch, POS/VietQR, JSON Grid, virtualized table, Cross-Sheet, catalog địa giới | TypeScript và 18 Vitest tests đạt |
| Tiếp theo | CRUD Nhân sự và Thu chi, mở rộng catalog địa giới, chỉnh sửa hồ sơ khách hàng | Có schema, owner policy và màn hình riêng |
| Production hardening | Load test 200.000 dòng/50 user, enforcement IP end-to-end, backup/restore và storage cleanup | Có số liệu benchmark và runbook |
| Nâng hạ tầng | Queue/worker, Redis hoặc Reserved/VM nếu cần realtime và xử lý nền liên tục | Đánh giá tải vượt Autoscale |

## 8. Nguyên tắc dữ liệu

Không renumber ID lịch sử. Khóa tự tăng chỉ dùng để tạo ID mới; sửa/xóa dòng phải lưu audit và không làm thay đổi khóa bản ghi cũ. Không sử dụng review, testimonial hoặc dữ liệu người dùng giả. Dữ liệu demo phải được nhận diện rõ ràng và không được coi là số liệu sản xuất thật.
