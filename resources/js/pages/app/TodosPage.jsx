import React from "react";
import AppLayout from "@/layouts/AppLayout";
import { Head, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import TodoItem from "@/components/todos/TodoItem";
import TodoForm from "@/components/todos/TodoForm";
import TodoFilter from "@/components/todos/TodoFilter";
import TodoChart from "@/components/todos/TodoChart";
import { Button } from "@/components/ui/button";

export default function TodosPage() {
    const { props } = usePage();
    const { todos, flash, filters, chartData } = props;

    React.useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    return (
        <AppLayout>
            <Head title="Daftar Todo" />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    📋 Daftar Todo Kamu
                </h1>

                {/* Statistik */}
                {/* Statistik */}
                <TodoChart todos={chartData} />

                {/* Filter */}
                <TodoFilter currentFilters={filters} />

                {/* Tombol tambah */}
                <div className="flex justify-end mb-4">
                    <TodoForm />
                </div>

                {/* Daftar Todo */}
                <div className="space-y-3">
                    {todos.data.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Belum ada aktivitas. Yuk tambah sekarang!
                        </p>
                    ) : (
                        todos.data.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))
                    )}
                </div>

                {/* Pagination sederhana */}
                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 space-x-2">
                    {todos.links.map((link, i) => {
                        let label = link.label;
                        if (label === "pagination.previous")
                            label = "← Sebelumnya";
                        if (label === "pagination.next") label = "Berikutnya →";

                        return (
                            <Button
                                key={i}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                    link.url &&
                                    router.visit(link.url, {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true, // history lebih bersih
                                    })
                                }
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
