import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import {
  FiUsers,
  FiTrash2,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiSettings,
  FiRefreshCw,
  FiX,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import { db } from "../../Firebase/Firebase";
import { useAuth } from "../../contexts/AuthContext";

function Settings() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const usersQuery = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const userList = snapshot.docs.map((userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        }));

        setUsers(userList);
        setLoading(false);
      },
      (firebaseError) => {
        console.error("Users load error:", firebaseError);
        setError("Unable to load user accounts.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const openDeleteModal = (targetUser) => {
    setSelectedUser(targetUser);
    setDeleteModalOpen(true);
    setMessage("");
    setError("");
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.id) return;
    if (selectedUser.id === user?.uid) {
      setError("You cannot delete your own active administrator account.");
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteDoc(doc(db, "users", selectedUser.id));

      setMessage(
        `User account "${selectedUser.name || selectedUser.email}" deleted successfully.`,
      );
      closeDeleteModal();
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.message || "Unable to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-rise  ml-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div className=" ml-5">
          <span className="section-label">System Administration</span>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
            Store Settings ⚙️
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure system rules, oversee staff privileges and manage user accounts.
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-xs dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-xs dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* System Settings & Actions */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6 space-y-3 shadow-lg  ml-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-market-lime/60 text-market-leaf text-2xl dark:bg-market-leaf/30 dark:text-market-lime">
            <FiRefreshCw />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
            Sync Inventory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Realtime Firestore listener connects live store updates directly to customer carts.
          </p>
          <div className="pt-2">
            <span className="badge-success text-[11px]">
              <FiCheckCircle /> Operational
            </span>
          </div>
        </div>

        <div className="card p-6 space-y-3 shadow-lg">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-600 text-2xl dark:bg-sky-950/50 dark:text-sky-400">
            <FiShield />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
            Admin Auth Policy
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Role-based route protection enforces administrative barriers for dashboard operations.
          </p>
          <div className="pt-2">
            <span className="badge-info text-[11px]">
              <FiShield /> Protected
            </span>
          </div>
        </div>

        <div className="card p-6 space-y-3 shadow-lg">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600 text-2xl dark:bg-amber-950/50 dark:text-amber-400">
            <FiInfo />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
            Order Lifecycle
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard status flow: Pending ➔ Confirmed ➔ Preparing ➔ Shipped ➔ Delivered.
          </p>
          <div className="pt-2">
            <span className="badge-warning text-[11px]">Active Policy</span>
          </div>
        </div>
      </div>

      {/* User Accounts Management Section */}
      <section className="card p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              User Accounts ({users.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage account permissions or remove inactive user documents.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((u) => {
              const isCurrentUser = u.id === user?.uid;
              const isAdmin = u.role === "admin";

              return (
                <div
                  key={u.id}
                  className="card p-5 space-y-3 shadow-md transition-all duration-300 hover:shadow-xl hover:border-market-leaf/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="truncate text-sm font-bold text-slate-800 dark:text-white">
                      {u.name || "Unnamed"}
                    </strong>
                    {isAdmin ? (
                      <span className="badge-info text-[10px]">Admin</span>
                    ) : (
                      <span className="badge-success text-[10px]">User</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                    <FiMail className="shrink-0" />
                    <span className="truncate">{u.email || "No email"}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      {isCurrentUser ? "(Current User)" : `ID: ${u.id.slice(0, 6)}...`}
                    </span>

                    {!isCurrentUser && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700"
                        onClick={() => openDeleteModal(u)}
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Delete User Modal */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-rise">
          <div className="card w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-2xl dark:bg-red-950/50">
                <FiAlertTriangle />
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-slate-800 dark:text-white">
                  Delete Account
                </h3>
                <span className="text-xs text-slate-400">Confirm permanent deletion</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete user{" "}
              <strong>{selectedUser.name || selectedUser.email}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger px-5 py-2 text-xs"
                onClick={handleDeleteUser}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
