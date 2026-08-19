# BreweryOS — Mô hình liên module và quyền nghiệp vụ

## Luồng dữ liệu liên module

BreweryOS dùng các khóa số tự tăng làm định danh ổn định, không renumber dữ liệu lịch sử. Nguyên liệu liên kết với công thức và giao dịch kho; công thức liên kết loại bia; lô sản xuất liên kết loại bia và các bước sản xuất; đơn mua liên kết nhà cung cấp, chi tiết đơn mua và giao dịch nhập kho; đơn POS liên kết khách hàng, sản phẩm và phiếu thu tài chính khi `referenceType = pos`; nhân sự liên kết chấm công, đơn nghỉ phép và workflow task; thiết bị liên kết lịch bảo dưỡng, phiếu sự cố và cảnh báo quá hạn.

## Ma trận quyền

| Nghiệp vụ | User | Admin | Kiểm soát |
|---|---|---|---|
| Đọc dữ liệu vận hành | Trong phạm vi bản ghi do mình tạo hoặc được gán | Toàn phạm vi | `protectedProcedure`, owner/RLS |
| Tạo bản ghi | Được phép nếu vượt validation | Được phép | Audit actor, IP, device, user-agent |
| Sửa/xóa bản ghi | Chỉ bản ghi do mình tạo | Toàn phạm vi | So sánh `oldValue → newValue` |
| Duyệt đơn nghỉ | Không | Có | `adminProcedure`, chỉ xử lý trạng thái pending |
| Xem audit và người dùng | Không | Có | Khu vực quản trị riêng |
| Cảnh báo Workflow | Xem cảnh báo trong phạm vi | Xem toàn hệ thống | low stock, maintenance overdue, leave pending |

## Zero-Trust ứng dụng

Mỗi request protected được kiểm tra phiên đăng nhập, vai trò, access mode và metadata thiết bị/IP. Chính sách `full`, `read_only`, `deny` được áp dụng tại lớp procedure; firewall IP cấp mạng và fingerprint phần cứng tuyệt đối vẫn là cấu hình vận hành sau deploy, không được giả định trong ứng dụng.

## Khả năng mở rộng

Danh sách nguyên liệu có cursor pagination; bảng lớn dùng vùng cuộn/virtualized rendering; export xử lý phía client; các luồng batch insert giới hạn kích thước request và có audit. Harness 200.000 dòng/50 user chỉ là kiểm tra tổng hợp, không thay thế load test với staging database.
