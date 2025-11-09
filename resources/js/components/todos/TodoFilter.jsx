import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TodoFilter({ currentFilters = {} }) {
    const [search, setSearch] = useState(currentFilters.search || "");
    const [status, setStatus] = useState(currentFilters.status || "all");

    // ⛔ jangan tembak request pada render pertama
    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return; // skip efek pertama kali mount
        }

        const t = setTimeout(() => {
            // saat filter berubah, kita paksa page=1 supaya tidak “nyangkut”
            router.get(
                "/todos",
                { search, status, page: 1 },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 500);

        return () => clearTimeout(t);
    }, [search, status]);

    const handleFilter = () => {
        router.get(
            "/todos",
            { search, status, page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
            <div className="flex gap-2">
                <Input
                    placeholder="Cari todo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-60"
                />
                <Button onClick={handleFilter}>Cari</Button>
            </div>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
            >
                <option value="all">Semua</option>
                <option value="done">Selesai</option>
                <option value="pending">Belum</option>
            </select>
        </div>
    );
}
