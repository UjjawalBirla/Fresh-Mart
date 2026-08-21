import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import {
  FiUsers,
  FiSearch,
  FiMail,
  FiCalendar,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { db } from "../../Firebase/Firebase";

function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const usersQuery = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        userList.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });

        setUsers(userList);
        setLoading(false);
      },
      (err) => {
        console.error("Customers Fetch Error:", err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Joined recently";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Joined recently";
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = u.name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const s = search.trim().toLowerCase();
    return name.includes(s) || email.includes(s);
  });

  const totalCustomers = users.filter((u) => u.role !== "admin").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-8 pb-16 animate-rise">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b   border-slate-200/80 pb-6 dark:border-slate-800">
        <div className="ml-5">
          <span className="section-label ">Account Directory</span>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
            Customer Directory 👥
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 ">
            View registered shopper profiles, emails and registration dates.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-market-lime/60 text-market-leaf text-2xl dark:bg-market-leaf/30 dark:text-market-lime">
            <FiUsers />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Registered</span>
            <strong className="font-display text-2xl font-black text-slate-800 dark:text-white block">
              {users.length} accounts
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 text-2xl dark:bg-emerald-950/50 dark:text-emerald-400">
            <FiUserCheck />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Shopper Customers</span>
            <strong className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
              {totalCustomers} shoppers
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-600 text-2xl dark:bg-sky-950/50 dark:text-sky-400">
            <FiShield />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Store Administrators</span>
            <strong className="font-display text-2xl font-black text-sky-600 dark:text-sky-400 block">
              {totalAdmins} admins
            </strong>
          </div>
        </div>
      </section>

      {/* Search Toolbar */}
      <div className="card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 shadow-md">
        <div className="input-field min-h-10 py-1 flex-1 sm:max-w-md">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs"
          />
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredUsers.length} accounts
        </span>
      </div>

      {/* Customers List Grid */}
      <section className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="card p-12 text-center text-slate-400 text-sm">
            No customers matching your search query.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((u) => {
              const isAdmin = u.role === "admin";
              return (
                <div
                  key={u.id}
                  className="card p-5 space-y-4 shadow-md transition-all duration-300 hover:shadow-xl hover:border-market-leaf/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-market-leaf to-emerald-400 text-white font-black text-lg shadow-md">
                        {(u.name || u.email || "U")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <strong className="block truncate text-sm font-bold text-slate-800 dark:text-white">
                          {u.name || "Customer"}
                        </strong>
                        <span className="text-[11px] text-slate-400 truncate block">
                          ID: #{u.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    {isAdmin ? (
                      <span className="badge-info text-[10px]">Admin</span>
                    ) : (
                      <span className="badge-success text-[10px]">Customer</span>
                    )}
                  </div>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <FiMail className="text-slate-400 shrink-0" />
                      <span className="truncate">{u.email || "No email on record"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-slate-400 shrink-0" />
                      <span>{formatDate(u.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Customers;
