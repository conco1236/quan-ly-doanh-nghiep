# Quản Lý Doanh Nghiệp

Hệ thống quản trị doanh nghiệp nội bộ dành cho nhà máy bia và mô hình sản xuất – thương mại. Ứng dụng cung cấp một giao diện dark navy–amber bằng tiếng Việt để điều hành sản xuất, kho, bán hàng POS, chất lượng, nhân sự, tài chính, mua hàng, bảo trì và báo cáo.

> **Mục tiêu:** tập trung dữ liệu vận hành vào một hệ thống có phân quyền, audit trail, workflow cảnh báo và báo cáo Excel/PDF chuyên nghiệp.

Repository chính thức: [conco1236/quan-ly-doanh-nghiep](https://github.com/conco1236/quan-ly-doanh-nghiep)

## 1. Tổng quan chức năng

| Phân hệ | Phạm vi chính |
|---|---|
| Dashboard | KPI doanh thu, tồn kho, đơn hàng, lô sản xuất, biểu đồ theo thời gian và cảnh báo workflow |
| Sản xuất | Loại bia, công thức, lô nấu, công đoạn đường hóa/lên men/lọc/đóng chai và báo cáo giá vốn |
| Kho | Nguyên liệu, nhập/xuất, tồn kho, giao dịch kho, cảnh báo tồn thấp và phân trang dữ liệu lớn |
| POS bán hàng | Giỏ hàng, tính tiền, đơn hàng, VietQR động, hóa đơn in và đối soát doanh thu |
| KCS/QC | Tiêu chuẩn kiểm tra, kết quả QC, ngưỡng Min/Max và cảnh báo dữ liệu lệch chuẩn |
| Nhân sự | CRUD nhân viên, phòng ban, trạng thái, chấm công, ngày phép, duyệt nghỉ và bảng công tháng |
| Tài chính | Sổ quỹ, phiếu thu/chi, công nợ phải thu/phải trả và đối soát doanh thu POS |
| Mua hàng | Nhà cung cấp, đơn mua, nhận hàng và tự động cập nhật tồn nguyên liệu |
| Bảo trì | Tài sản, lịch bảo dưỡng, cảnh báo quá hạn, phiếu sự cố và theo dõi chi phí |
| Thương hiệu & PDF | Logo tùy chỉnh, tên công ty, slogan, địa chỉ, hotline, mã số thuế, email, website và preview PDF |
| Báo cáo | Dashboard trực quan, xuất CSV/XLSX nhiều sheet, công thức tổng cộng/subtotal, biểu đồ và PDF có chữ ký |

## 2. Kiến trúc kỹ thuật

Ứng dụng sử dụng React 19 và Vite ở phía client, Express 4 kết hợp tRPC 11 ở phía server, Drizzle ORM với MySQL/TiDB ở tầng dữ liệu và Tailwind CSS 4 cho giao diện. Các kiểu dữ liệu tRPC được chia sẻ tự động giữa frontend và backend, còn SuperJSON giữ nguyên các kiểu thời gian khi truyền qua RPC.

```text
client/src/
├── pages/Home.tsx              # Dashboard và các panel nghiệp vụ
├── components/                 # Layout và thành phần giao diện dùng chung
├── lib/trpc.ts                 # Client tRPC
├── lib/export.ts               # CSV, XLSX native và PDF POS/HR
└── index.css                   # Theme navy–amber

drizzle/
├── schema.ts                   # Schema MySQL/TiDB
├── relations.ts                # Quan hệ Drizzle
└── *.sql                       # Các migration theo thứ tự

server/
├── routers.ts                  # Contract và business procedure tRPC
├── db.ts                       # Helper truy vấn/ghi dữ liệu
├── erp-access.ts               # Kiểm tra quyền/RLS ứng dụng
├── erp-security.ts             # Metadata request, audit và policy
├── storage.ts                  # S3 storage helper
└── _core/                      # Auth, OAuth, server và Heartbeat framework

shared/
├── locationCatalog.ts          # Danh mục địa lý
├── smartUi.ts                  # Nhận diện nhóm/icon nghiệp vụ
└── types.ts                    # Kiểu dùng chung
```

## 3. Yêu cầu hệ thống

| Thành phần | Khuyến nghị |
|---|---|
| Node.js | 22.x hoặc phiên bản tương thích với Vite/tsx hiện tại |
| pnpm | 10.x; repository đã khai báo `packageManager` |
| Database | MySQL hoặc TiDB tương thích MySQL |
| Trình duyệt | Chromium, Chrome, Edge, Firefox hoặc Safari phiên bản hiện đại |
| Storage | S3-compatible storage cho logo và file người dùng |

## 4. Cài đặt cục bộ

Clone repository và cài dependencies:

```bash
git clone https://github.com/conco1236/quan-ly-doanh-nghiep.git
cd quan-ly-doanh-nghiep
pnpm install
```

Không commit file `.env` hoặc secret thật vào GitHub. Với môi trường WebDev, các secret hệ thống được quản lý trong phần Secrets của project. Với môi trường tự quản lý, hãy tạo file `.env` cục bộ dựa trên danh sách ở mục tiếp theo.

## 5. Biến môi trường

Các biến bắt buộc tùy theo môi trường triển khai được mô tả dưới đây. Không dùng giá trị mẫu trong production.

| Biến | Phạm vi | Mục đích |
|---|---|---|
| `DATABASE_URL` | Server | Chuỗi kết nối MySQL/TiDB |
| `JWT_SECRET` | Server | Ký session cookie và thông tin xác thực |
| `VITE_APP_ID` | Server/Client | Định danh ứng dụng OAuth |
| `OAUTH_SERVER_URL` | Server | URL OAuth backend |
| `VITE_OAUTH_PORTAL_URL` | Client | URL portal đăng nhập |
| `OWNER_OPEN_ID` | Server | Định danh owner dùng cho quyền quản trị ban đầu |
| `OWNER_NAME` | Server | Tên owner mặc định |
| `BUILT_IN_FORGE_API_URL` | Server | URL built-in API của Manus |
| `BUILT_IN_FORGE_API_KEY` | Server | Token server-side cho built-in API |
| `VITE_FRONTEND_FORGE_API_URL` | Client | URL built-in API phía frontend |
| `VITE_FRONTEND_FORGE_API_KEY` | Client | Token frontend do hệ thống cấp |
| `VITE_ANALYTICS_ENDPOINT` | Client | Endpoint analytics, nếu bật |
| `VITE_ANALYTICS_WEBSITE_ID` | Client | Website ID analytics, nếu bật |
| `VITE_APP_TITLE` | Client/WebDev | Tên hiển thị của ứng dụng; hiện dùng `Quản Lý Doanh Nghiệp` |
| `VITE_APP_LOGO` | Client/WebDev | Logo ứng dụng do nền tảng quản lý |

Ví dụ tối thiểu cho môi trường server cục bộ:

```dotenv
DATABASE_URL=mysql://user:password@127.0.0.1:3306/quan_ly_doanh_nghiep
JWT_SECRET=thay-bang-chuoi-bi-mat-dai-va-ngau-nhien
VITE_APP_ID=your-oauth-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Quản trị viên
```

Các biến chứa token, mật khẩu, URL ký hoặc thông tin định danh không được đưa vào README, commit, log hoặc mã frontend nếu không cần thiết.

## 6. Database và migration

Schema chính nằm tại `drizzle/schema.ts`. Khi thay đổi schema, thực hiện theo thứ tự:

```bash
pnpm drizzle-kit generate
```

Sau đó đọc migration mới trong `drizzle/`, kiểm tra rằng migration không có thao tác `DROP` hoặc thay đổi dữ liệu ngoài dự kiến, rồi áp dụng migration bằng cơ chế migrate của môi trường triển khai. Trên WebDev, dùng thao tác **Migrate Schema** hoặc công cụ quản trị database của project; không sửa dữ liệu production bằng script tùy tiện.

Các migration branding gần nhất bổ sung thông tin logo và liên hệ cho `system_branding`. Hệ thống chỉ lưu metadata và S3 key/URL, không lưu bytes của file logo trong database.

## 7. Chạy ứng dụng

### Development

```bash
pnpm dev
```

Server development phục vụ API và frontend qua cổng do môi trường quản lý. Không hardcode cổng trong mã nguồn. Truy cập URL được in trong terminal hoặc URL Preview của WebDev.

### Kiểm tra TypeScript

```bash
pnpm check
```

### Production build

```bash
pnpm build
```

Lệnh build tạo frontend tối ưu bằng Vite và bundle server bằng esbuild. Cảnh báo chunk frontend lớn hơn 500 KB là cảnh báo tối ưu hóa, không phải lỗi build; có thể xử lý sau bằng dynamic import và manual chunks nếu cần.

### Chạy production bundle

Môi trường triển khai nên dùng cơ chế hosting của WebDev hoặc process manager phù hợp. Không chạy server production bằng `tsx watch`. Port phải được đọc từ biến môi trường hoặc do nền tảng cung cấp.

## 8. Kiểm thử

Chạy toàn bộ Vitest:

```bash
pnpm test
```

Một số nhóm test quan trọng:

| Nhóm | Nội dung |
|---|---|
| `erp.security.test.ts` | Quyền truy cập, Zero-Trust metadata và policy |
| `erp.access.test.ts` | Phân quyền và phạm vi dữ liệu |
| `branding.test.ts` | Chuẩn hóa branding, logo và trường liên hệ |
| `hr.attendance.test.ts` | Chấm công, ngày phép và tổng hợp tháng |
| `finance.test.ts` | Thu/chi, công nợ và đối soát |
| `purchasing.test.ts` | Nhà cung cấp, đơn mua và nhận hàng |
| `maintenance.test.ts` | Lịch bảo dưỡng, sự cố và chi phí |
| `client/src/lib/export.test.ts` | CSV/XLSX/PDF, công thức tổng và workbook |
| `scripts/load-smoke.mjs` | Kiểm tra mô phỏng tải/cursor/virtualized data |

Trước khi tạo checkpoint hoặc gửi pull request, nên chạy:

```bash
pnpm test && pnpm check && pnpm build
```

## 9. Cấu hình thương hiệu và báo cáo

Admin mở mục **Thương hiệu & PDF** trong giao diện để cập nhật logo PNG/JPEG tối đa 5 MB, tên công ty, slogan, địa chỉ, hotline, mã số thuế, email và website. File logo được upload qua S3; API chỉ lưu metadata, có allowlist MIME, giới hạn kích thước và audit.

Các báo cáo POS/HR hỗ trợ Excel/PDF. Workbook HR gồm nhiều sheet, dòng tổng, subtotal theo phòng ban và sheet biểu đồ. PDF có logo, thông tin doanh nghiệp, người phê duyệt, chức danh và vùng ký. Màn hình BrandingPanel có preview PDF POS/HR sử dụng cùng pipeline tạo file thật.

Thông tin email, website, địa chỉ, hotline và mã số thuế chỉ xuất hiện trên hóa đơn POS khi đã được cấu hình. Nếu để trống, dòng tương ứng sẽ được ẩn khỏi bill.

## 10. Bảo mật và vận hành

Bất kỳ procedure nào đọc hoặc ghi dữ liệu nghiệp vụ phải dùng lớp protected/admin phù hợp. Business mutation cần kiểm tra actor, owner scope, access mode và ghi audit với giá trị cũ/mới khi dữ liệu thay đổi. Không tin tưởng dữ liệu từ client; mọi giới hạn chuỗi, MIME, kích thước file và trạng thái nghiệp vụ phải được kiểm tra lại ở server.

Khi triển khai thật, cần cấu hình Zero-Trust device/session, policy IP, RLS theo tổ chức và giám sát audit log. Không dùng local storage làm nguồn sự thật cho file; bytes phải nằm trong S3-compatible storage, database chỉ giữ metadata và quyền truy cập.

Các cảnh báo tồn kho thấp, bảo trì quá hạn và đơn nghỉ chờ duyệt được thiết kế để chạy qua workflow/Heartbeat. Không thêm `setInterval` hoặc timer nền trong process web nếu công việc cần chạy định kỳ; dùng scheduler của nền tảng để tránh mất job khi instance autoscale về 0.

## 11. Quy trình phát triển và GitHub

Tạo branch theo phạm vi thay đổi, ví dụ:

```bash
git checkout -b feat/pos-contact-fields
```

Sau khi hoàn tất, chạy test/check/build, xem diff và commit với message ngắn gọn:

```bash
git status
git diff --stat
git add <files>
git commit -m "feat: add contact fields to POS receipt"
git push -u origin feat/pos-contact-fields
```

Repository chính đang dùng branch `main`. Không commit secret, file `.env`, dữ liệu khách hàng thật hoặc file nhị phân lớn. Trước khi publish WebDev, tạo checkpoint để có thể rollback an toàn.

## 12. Xử lý lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `DATABASE_URL` thiếu | Kiểm tra Secrets/env của project và khởi động lại server |
| Migration báo lỗi cột đã tồn tại | Kiểm tra schema database và lịch sử migration trước khi chạy lại; không tự ý drop bảng |
| OAuth không đăng nhập | Kiểm tra `VITE_APP_ID`, `OAUTH_SERVER_URL`, portal URL và callback đã đăng ký |
| PDF không hiển thị logo | Kiểm tra logo đã upload đúng MIME, S3 URL có thể đọc và fallback vector còn hoạt động |
| VietQR không tạo URL | Kiểm tra bank BIN, số tài khoản, tên tài khoản và tổng tiền lớn hơn 0 |
| Test database timeout | Kiểm tra database connection, chạy lại test trong môi trường ổn định và xem `.manus-logs/` |
| Dev server không phản hồi | Kiểm tra `.manus-logs/devserver.log`, sau đó restart server qua WebDev |
| Build báo chunk lớn | Đây là cảnh báo kích thước; kiểm tra build vẫn có dòng `built successfully`, sau đó cân nhắc code splitting |

## 13. Triển khai trên WebDev

Project được thiết kế cho hosting WebDev với database, server và user authentication. Sau khi tạo checkpoint ổn định, dùng nút **Publish** trong Management UI để triển khai. Không hardcode port, không đưa CLI sandbox vào runtime và không lưu file tĩnh lớn trong thư mục frontend.

Đối với dữ liệu và file sản xuất, bật SSL database, kiểm tra quyền S3, giới hạn IP truy cập theo chính sách doanh nghiệp và xác nhận backup/restore trước khi đưa hệ thống vào vận hành chính thức.

## 14. Giấy phép và dữ liệu

Repository là repository riêng tư của chủ sở hữu. Mã nguồn, cấu hình, dữ liệu ERP, thông tin nhân sự, tài chính và khách hàng phải được xử lý như dữ liệu nội bộ. Chỉ cấp quyền GitHub, database, S3 và WebDev theo nguyên tắc quyền tối thiểu.
