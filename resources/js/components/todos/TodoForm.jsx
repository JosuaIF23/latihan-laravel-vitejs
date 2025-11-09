import React from "react";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function TodoForm() {
    const handleAdd = () => {
        Swal.fire({
            title: "Tambah Todo Baru",
            html: `
                <input id="title" class="swal2-input" placeholder="Judul Todo">
                <textarea id="description" class="swal2-textarea" placeholder="Deskripsi"></textarea>
                <select id="is_finished" class="swal2-select">
                    <option value="false">Belum Selesai</option>
                    <option value="true">Selesai</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            preConfirm: () => {
                return {
                    title: document.getElementById("title").value,
                    description: document.getElementById("description").value,
                    is_finished:
                        document.getElementById("is_finished").value === "true",
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.post("/todos/store", result.value);
            }
        });
    };

    return (
        <div className="mt-4 text-right">
            <Button onClick={handleAdd} className="bg-blue-600 text-white">
                + Tambah Todo
            </Button>
        </div>
    );
}
