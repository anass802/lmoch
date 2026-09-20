import { useEffect, useRef, useState } from "react";
import {
  getReservations,
  deleteReservation,
} from "../api/Adminservice";

import type {
  Reservation,
  ReservationsPaginated,
  GetReservationsParams,
} from "../types/admin";



const SORT_OPTIONS: { value: NonNullable<GetReservationsParams["sort"]>; label: string }[] = [
  { value: "date_arrivee", label: "Date d'arrivée" },
  { value: "date_sortie", label: "Date de départ" },
  { value: "created_at", label: "Date de création" },
  { value: "nom_chat", label: "Nom du chat" },
  { value: "age_mois", label: "Âge" },
];

export default function ReservationsAdmin() {
  const [data, setData] = useState<ReservationsPaginated | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  
  const [sort, setSort] = useState<GetReservationsParams["sort"]>("date_arrivee");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [pendingDelete, setPendingDelete] = useState<Reservation | null>(null);
  const [rowBusy, setRowBusy] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReservations({
        search: search || undefined,
        sort,
        dir,
        page,
        per_page: 15,
      });
      setData(res.data.data);
    } catch {
      setError("Impossible de charger les réservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort, dir, page]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      load();
    }, 350);
  };

  const toggleSort = (col: NonNullable<GetReservationsParams["sort"]>) => {
    if (sort === col) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(col);
      setDir("asc");
    }
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setRowBusy(id);
    try {
      await deleteReservation(id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((r) => r.id !== id),
              total: prev.total - 1,
            }
          : prev
      );
    } catch {
      setError("La suppression a échoué.");
    } finally {
      setRowBusy(null);
      setPendingDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] p-4 text-[#1f2d3d] sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1f2d3d] sm:text-3xl">
            Réservations
          </h1>

          <p className="mt-1 text-sm text-[#4a5b6d]">
            {data
              ? `${data.total} réservation${data.total > 1 ? "s" : ""}`
              : ""}
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#d9e0dd] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          className="w-full rounded-xl border border-[#d9e0dd] bg-white px-4 py-3 text-sm text-[#1f2d3d] outline-none transition placeholder:text-[#8a969f] focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20 sm:max-w-md"
          type="text"
          placeholder="Rechercher un chat, une race, un téléphone…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        
         
       
      </div>

      {/* Error */}
      {error && (
        <p className="mb-5 rounded-xl border border-[#b3432b]/20 bg-[#b3432b]/10 px-4 py-3 text-sm font-medium text-[#b3432b]">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#d9e0dd] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d9e0dd] bg-[#f8faf9]">
                {SORT_OPTIONS.map((opt) => (
                  <th
                    key={opt.value}
                    onClick={() => toggleSort(opt.value)}
                    className="cursor-pointer select-none whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#4a5b6d] transition hover:bg-[#eef2f0] hover:text-[#1f2d3d]"
                  >
                    {opt.label}

                    {sort === opt.value && (
                      <span className="ml-1 text-[#c9a227]">
                        {dir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}

                 <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#4a5b6d]">
                  Stérilisé
                </th>
                <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#4a5b6d]">
                  Téléphone
                </th>
                <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#4a5b6d]">
                  Action
                </th>

                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e8ecea]">
              {/* Loading */}
              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-[#4a5b6d]"
                  >
                    Chargement…
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && data?.data.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-[#4a5b6d]"
                  >
                    Aucune réservation trouvée.
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!loading &&
                data?.data.map((r) => (
                  <tr
                    key={r.id}
                    className={`transition ${
                      rowBusy === r.id
                        ? "opacity-50"
                        : "hover:bg-[#fafcfb]"
                    }`}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1f2d3d]">
                      {r.date_arrivee?.slice(0, 10)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1f2d3d]">
                      {r.date_sortie?.slice(0, 10)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#4a5b6d]">
                      {r.created_at.slice(0, 10)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#1f2d3d]">
                      <strong className="font-semibold text-[#1f2d3d]">
                        {r.nom_chat}
                      </strong>

                      <div className="mt-1 text-xs text-[#8a969f]">
                        {r.race}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1f2d3d]">
                      {r.age_mois} mois
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1f2d3d]">
                      {r.sterilise?"sterilise":"non sterilise"} 
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#1f2d3d]">
                      {r.telephone}
                    </td>

                    <td className="px-5 py-4 text-right flex justify-start">
                      <button
                        className="rounded-lg border border-[#b3432b]/30 bg-white px-3 py-2 text-sm font-medium text-[#b3432b] transition hover:border-[#b3432b] hover:bg-[#b3432b] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={rowBusy === r.id}
                        onClick={() => setPendingDelete(r)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.last_page > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#d9e0dd] bg-white px-4 py-4 shadow-sm sm:flex-row">
          <button
            disabled={data.current_page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-full rounded-xl border border-[#d9e0dd] bg-white px-4 py-2.5 text-sm font-medium text-[#1f2d3d] transition hover:border-[#c9a227] hover:bg-[#f8faf9] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Précédent
          </button>

          <span className="text-sm font-medium text-[#4a5b6d]">
            Page{" "}
            <span className="font-semibold text-[#1f2d3d]">
              {data.current_page}
            </span>{" "}
            /{" "}
            <span className="font-semibold text-[#1f2d3d]">
              {data.last_page}
            </span>
          </span>

          <button
            disabled={data.current_page >= data.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="w-full rounded-xl border border-[#d9e0dd] bg-white px-4 py-2.5 text-sm font-medium text-[#1f2d3d] transition hover:border-[#c9a227] hover:bg-[#f8faf9] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setPendingDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#d9e0dd] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[#1f2d3d]">
              Supprimer cette réservation ?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#4a5b6d]">
              La réservation de{" "}
              <strong className="font-semibold text-[#1f2d3d]">
                {pendingDelete.nom_chat}
              </strong>{" "}
              sera définitivement supprimée.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-xl border border-[#d9e0dd] bg-white px-5 py-2.5 text-sm font-medium text-[#4a5b6d] transition hover:bg-[#f4f7f5] hover:text-[#1f2d3d]"
                onClick={() => setPendingDelete(null)}
              >
                Annuler
              </button>

              <button
                className="rounded-xl bg-[#b3432b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#963a26] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}