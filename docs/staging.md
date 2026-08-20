# Môi trường staging và integration test

## Mục đích và phạm vi

CI tạo một **database staging dùng một lần** có tên `erp_staging` trong MySQL 8 chạy tách biệt trong mỗi workflow. Schema được áp dụng từ toàn bộ migration Drizzle trước khi chạy integration test. Database này không dùng credentials, dữ liệu hoặc endpoint của production; sau mỗi job, máy ảo và dữ liệu test đều được hủy.

## Các lớp bảo vệ

| Kiểm soát | Cách hoạt động |
|---|---|
| Tách database | Integration job chỉ kết nối `erp_staging` trên service MySQL riêng của GitHub Actions. |
| Chặn chạy nhầm | Test chỉ hoạt động khi đồng thời có `RUN_INTEGRATION_TESTS=true`, `APP_ENV=staging` và database trong `DATABASE_URL` khớp `STAGING_DATABASE_NAME`. |
| Migration có kiểm soát | `pnpm db:migrate` chạy trước test, chỉ nhận `DATABASE_URL` của job staging. |
| Dọn dẹp dữ liệu | Test CRUD dùng mã định danh riêng và xóa bản ghi nguyên liệu, giao dịch kho, audit liên quan trong `finally`. |
| Không dùng secret production | Job staging không tham chiếu bất kỳ secret production nào. |

## Chạy trên máy phát triển

Khởi tạo một MySQL rỗng tên `erp_staging`, sau đó chỉ định URL staging trước khi chạy migration và test. Không dùng URL production cho các lệnh này.

```bash
export DATABASE_URL='mysql://<user>:<password>@127.0.0.1:3306/erp_staging'
export APP_ENV=staging
export STAGING_DATABASE_NAME=erp_staging
pnpm db:migrate
pnpm test:integration
```

Nếu cần một staging bền vững để xem giao diện trước khi phát hành, cần cấp một database TiDB/MySQL riêng và một deployment staging riêng. Database đó phải dùng tên có hậu tố `staging`, credentials độc lập và không sao chép dữ liệu cá nhân từ production.

## Chính sách merge trên GitHub

Nhánh `main` đã được bảo vệ. Mọi thay đổi phải đi qua pull request, giải quyết toàn bộ hội thoại và có hai job CI thành công trên commit mới nhất trước khi merge: `Test, type-check and production build` và `Integration tests on isolated staging database`. Quy tắc áp dụng cả với quản trị viên; force-push và xóa nhánh bị tắt.
