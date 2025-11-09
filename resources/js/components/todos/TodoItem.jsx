import React from "react";
import { router, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TodoItem({ todo }) {
    // ✏️ UPDATE TODO
    const handleUpdate = () => {
        Swal.fire({
            title: "Edit Todo",
            html: `
                <input id="title" class="swal2-input" placeholder="Judul" value="${
                    todo.title
                }">
                <textarea id="description" class="swal2-textarea" placeholder="Deskripsi">${
                    todo.description || ""
                }</textarea>
                <select id="is_finished" class="swal2-select">
                    <option value="false" ${
                        !todo.is_finished ? "selected" : ""
                    }>Belum Selesai</option>
                    <option value="true" ${
                        todo.is_finished ? "selected" : ""
                    }>Selesai</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            preConfirm: () => ({
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                is_finished:
                    document.getElementById("is_finished").value === "true",
            }),
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/todos/${todo.id}/update`, result.value);
            }
        });
    };

    // ❌ HAPUS TODO
    const handleDelete = () => {
        Swal.fire({
            title: "Konfirmasi Hapus",
            html: `
                Untuk menghapus todo <b>${todo.title}</b>, ketik judulnya di bawah:
                <input id="confirmInput" class="swal2-input" placeholder="Ketik judul di sini">
            `,
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            preConfirm: () => {
                const input = document.getElementById("confirmInput").value;
                if (input !== todo.title) {
                    Swal.showValidationMessage("Judul tidak cocok!");
                }
                return input;
            },
        }).then((res) => {
            if (res.isConfirmed) {
                router.post(`/todos/${todo.id}/delete`);
            }
        });
    };

    return (
        <Card>
            <CardContent className="flex items-center justify-between py-4">
                <div>
                    <h3
                        className={`font-semibold ${
                            todo.is_finished
                                ? "line-through text-muted-foreground"
                                : ""
                        }`}
                    >
                        {todo.title}
                    </h3>
                    {todo.description && (
                        <p className="text-sm text-muted-foreground">
                            {todo.description}
                        </p>
                    )}
                </div>

                {/* 🔘 Action Buttons */}
                <div className="flex space-x-2">
                    {/* Detail Button */}
                    <Link href={`/todos/${todo.id}`}>
                        <Button variant="secondary" size="sm">
                            Detail
                        </Button>
                    </Link>

                    {/* Update Button */}
                    <Button variant="outline" size="sm" onClick={handleUpdate}>
                        Update
                    </Button>

                    {/* Delete Button */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                    >
                        Hapus
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
