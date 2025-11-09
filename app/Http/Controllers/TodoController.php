<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * 🧾 Tampilkan semua todo milik user yang login.
     */
    public function index(Request $request)
    {
        $query = Todo::where('user_id', Auth::id());

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_finished', $request->status === 'done');
        }

        if ($request->filled('search')) {
            $query->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($request->search) . '%']);
        }

        // Pagination (5 per halaman)
        $todos = $query->latest()->paginate(5)->withQueryString();

        // Data chart → semua todo tanpa pagination
        $chartData = Todo::where('user_id', Auth::id())->get();

        return Inertia::render('app/TodosPage', [
            'todos' => $todos,
            'chartData' => $chartData, // ✅ tambahan ini
            'filters' => $request->only(['search', 'status']),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }


    /**
     * ➕ Simpan todo baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|string|max:255',
        ]);

        Todo::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Todo berhasil ditambahkan!');
    }

    /**
     * ✏️ Update todo yang ada.
     */
    public function update(Request $request, Todo $todo)
    {
        // Pastikan hanya pemiliknya yang bisa ubah
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_finished' => 'boolean',
        ]);

        $todo->update($validated);

        return back()->with('success', 'Todo berhasil diperbarui!');
    }

    /**
     * ❌ Hapus todo.
     */
    public function delete(Todo $todo)
    {
        // Pastikan hanya pemiliknya yang bisa hapus
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $todo->delete();

        return back()->with('success', 'Todo berhasil dihapus!');
    }
    /**
     * 📄 Menampilkan detail todo.
     */
    public function show(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('app/TodoDetailPage', [
            'todo' => $todo,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * 🖼️ Mengubah cover todo.
     */
    public function updateCover(Request $request, Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'cover' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // simpan file ke public/storage/covers
        $path = $request->file('cover')->store('covers', 'public');

        $todo->update(['cover' => $path]);

        return back()->with('success', 'Cover berhasil diperbarui!');
    }
}
