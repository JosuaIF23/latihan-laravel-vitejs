import React, { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function TodoDetailPage() {
    const { todo } = usePage().props;
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        todo.cover ? `/storage/${todo.cover}` : null
    );

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // buat preview sementara sebelum upload
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = () => {
        if (!file) {
            Swal.fire("Peringatan", "Pilih file dulu!", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("cover", file);
        router.post(`/todos/${todo.id}/cover`, formData, {
            onSuccess: () => {
                Swal.fire("Berhasil", "Cover berhasil diperbarui!", "success");
            },
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    📄 Detail Todo
                </h1>

                <div className="space-y-4 border rounded-lg p-4 bg-card shadow">
                    <p>
                        <strong>Judul:</strong> {todo.title}
                    </p>
                    <p>
                        <strong>Deskripsi:</strong> {todo.description || "-"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {todo.is_finished ? "✅ Selesai" : "❌ Belum Selesai"}
                    </p>

                    {preview && (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-w-sm rounded shadow"
                            />
                        </div>
                    )}

                    <div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="block mb-2"
                        />
                        <Button onClick={handleUpload} className="mr-2">
                            Ubah Cover
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.get("/todos")}
                        >
                            Kembali
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
