"use client";

import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/format";

type AdminOrder = {
  id: string;
  trackingId: string;
  fullName: string;
  email: string;
  status: string;
  total: number;
  createdAt: string;
};

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "failed"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders/list")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(orderId: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
  }

  if (loading) return <p className="text-sm text-fg-50">Loading orders...</p>;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Orders</h2>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-fg/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{order.trackingId}</p>
                <p className="text-xs text-fg-50">{order.fullName} · {order.email}</p>
              </div>
              <p className="text-sm">{formatNaira(order.total)}</p>
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value)}
              className="mt-3 rounded-md border border-fg/20 bg-page px-3 py-1.5 text-xs"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
