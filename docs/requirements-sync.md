# Đồng bộ yêu cầu lên GitHub

## Cách ghi nhận yêu cầu

Chủ sở hữu tạo một issue bằng biểu mẫu **Yêu cầu hệ thống** và giữ nhãn `requirement`. Quy trình tự động ghi một hàng tóm tắt vào `docs/requirements.md`, tạo pull request gắn nhãn `requirements-sync`, kích hoạt CI trên nhánh đó và yêu cầu GitHub auto-merge sau khi mọi check bắt buộc đạt.

## Biện pháp an toàn

Chỉ issue do chủ sở hữu repository tạo mới được đồng bộ. Pull request tự động chỉ được phép sửa duy nhất `docs/requirements.md`; mọi thay đổi mã nguồn, workflow hoặc cấu hình khác đều không được auto-merge. Branch protection trên `main` vẫn yêu cầu pull request, commit mới nhất, giải quyết hội thoại và hai job CI thành công.

## Quy trình khi tiếp nhận yêu cầu qua trao đổi

Mỗi yêu cầu mới được chuyển thành issue có nhãn `requirement`. GitHub sẽ lưu yêu cầu đó vào nhật ký qua pull request; việc triển khai mã nguồn tiếp theo vẫn đi theo pull request riêng để giữ review và CI độc lập.
