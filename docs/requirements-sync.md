# Đồng bộ yêu cầu lên GitHub

## Cách ghi nhận yêu cầu

Chủ sở hữu tạo một issue bằng biểu mẫu **Yêu cầu hệ thống** và giữ nhãn `requirement`. Quy trình tự động ghi một hàng tóm tắt vào `docs/requirements.md`, tạo pull request gắn nhãn `requirements-sync`, kích hoạt CI trên nhánh đó và yêu cầu GitHub auto-merge sau khi mọi check bắt buộc đạt.

## Biện pháp an toàn

Chỉ issue do chủ sở hữu repository tạo mới được đồng bộ. Pull request tự động chỉ được phép sửa duy nhất `docs/requirements.md`; mọi thay đổi mã nguồn, workflow hoặc cấu hình khác đều không được auto-merge. Branch protection trên `main` vẫn yêu cầu pull request, commit mới nhất, giải quyết hội thoại và hai job CI thành công.

## Quy trình khi tiếp nhận yêu cầu qua trao đổi

Mỗi yêu cầu mới được chuyển thành issue có nhãn `requirement`. GitHub sẽ lưu yêu cầu đó vào nhật ký qua pull request; việc triển khai mã nguồn tiếp theo vẫn đi theo pull request riêng để giữ review và CI độc lập.

## Phê duyệt CI khi cần

Repository không lưu credential GitHub riêng cho workflow đồng bộ. Nếu GitHub đánh dấu lần chạy CI của pull request tự động là **action required**, một quản trị viên phê duyệt lần chạy đó trong tab Actions. Sau khi hai check bắt buộc thành công, auto-merge đã bật sẽ tự hợp nhất pull request tài liệu. Đây là bước xác nhận an toàn do GitHub áp dụng cho pull request do workflow tạo.

## Project board theo dõi trạng thái

Project **Theo dõi yêu cầu ERP** tại `https://github.com/users/conco1236/projects/3` là board theo dõi tập trung. Board dùng repository mặc định `conco1236/quan-ly-doanh-nghiep` và workflow **Auto-add to project** với bộ lọc `is:issue label:requirement`. Vì vậy, mọi issue yêu cầu mới hoặc được cập nhật sẽ tự xuất hiện trên board với trạng thái mặc định **Todo**. Khi triển khai, cập nhật trạng thái trên board thành **In Progress**; khi yêu cầu hoàn tất và issue được đóng, chuyển sang **Done**.

Board có thêm Kanban view theo cột **Todo**, **In Progress** và **Done**. Workflow mặc định **Item closed** đang bật và tự đặt `Status: Done` khi issue được đóng. Hai issue requirement hiện có (#3 và #5) đã được đưa vào board để xác minh. Pull request tài liệu không mang nhãn `requirement` không thuộc phạm vi board.
