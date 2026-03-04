"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  email: string;
  name: string | null;
  totalCents: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const url = statusFilter ? `/api/admin/orders?status=${encodeURIComponent(statusFilter)}` : "/api/admin/orders";
        const res = await fetch(url);
        if (res.ok) setOrders(await res.json());
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, [statusFilter]);

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold text-text mb-4">Orders</h1>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="status" className="font-sans text-sm text-muted">Filter:</label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-bg px-3 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-sage-2"
        >
          <option value="">All</option>
          <option value="PENDING">Pending payment</option>
          <option value="PROCESSING">Processing</option>
          <option value="ON_HOLD">On hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
          <option value="FAILED">Failed</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>
      <div className="border border-border rounded-lg bg-surface overflow-hidden">
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b border-border bg-sage-1/50">
              <th className="text-left p-3 font-medium text-text">Order ID</th>
              <th className="text-left p-3 font-medium text-text">Date</th>
              <th className="text-left p-3 font-medium text-text">Customer</th>
              <th className="text-right p-3 font-medium text-text">Total</th>
              <th className="text-left p-3 font-medium text-text">Status</th>
              <th className="p-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-muted text-center">Loading…</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-muted text-center">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <code className="text-xs bg-bg px-1.5 py-0.5 rounded text-muted">
                      {order.id.slice(0, 12)}…
                    </code>
                  </td>
                  <td className="p-3 text-muted">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-text">
                    {order.name ? `${order.name} — ` : ""}{order.email}
                  </td>
                  <td className="p-3 text-right text-text">
                    ${(order.totalCents / 100).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span className="text-muted">{order.status.toLowerCase().replace(/_/g, " ")}</span>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-sage-dark hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
