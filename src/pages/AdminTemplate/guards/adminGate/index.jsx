import RequireAdmin from "../requireAdmin";
import AdminTemplate from "../..";

export default function AdminGate() {
  return (
    <RequireAdmin>
      <AdminTemplate />
    </RequireAdmin>
  );
}
