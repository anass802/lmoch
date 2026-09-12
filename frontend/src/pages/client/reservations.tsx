import { useState } from "react";
import { createReservation } from "../../api/ClientServices";
import type { ReservationPayload } from "../../types/Clients";

type FormState = {
  cat_name: string;
  breed: string;
  age_months: string;
  phone: string;
  arrival_date: string;
  departure_date: string;
  notes: string;
};

const emptyForm: FormState = {
  cat_name: "",
  breed: "",
  age_months: "",
  phone: "",
  arrival_date: "",
  departure_date: "",
  notes: "",
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ReservationPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<
    null | { id: number; cat_name: string }
  >(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));

    if (errors[field]) {
      setErrors((er) => ({ ...er, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.cat_name.trim()) {
      next.cat_name = "Le nom du chat est requis.";
    }

    if (!form.breed.trim()) {
      next.breed = "La race est requise.";
    }

    const age = Number(form.age_months);

    if (
      form.age_months === "" ||
      Number.isNaN(age) ||
      age < 0 ||
      age > 400
    ) {
      next.age_months = "Indiquez un âge en mois valide.";
    }

    if (!form.phone.trim()) {
      next.phone = "Un numéro de téléphone est requis.";
    }

    if (!form.arrival_date) {
      next.arrival_date = "La date d'arrivée est requise.";
    } else if (form.arrival_date < todayISO()) {
      next.arrival_date =
        "La date d'arrivée ne peut pas être dans le passé.";
    }

    if (!form.departure_date) {
      next.departure_date = "La date de départ est requise.";
    } else if (
      form.arrival_date &&
      form.departure_date <= form.arrival_date
    ) {
      next.departure_date =
        "La date de départ doit être après l'arrivée.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError(null);

    if (!validate()) return;

    const payload: ReservationPayload = {
      nom_chat: form.cat_name.trim(),
      race: form.breed.trim(),
      age_mois: Number(form.age_months),
      telephone: form.phone.trim(),
      date_arrivee: form.arrival_date,
      date_sortie: form.departure_date,
    };

    setSubmitting(true);

    try {
      const res = await createReservation(payload);

      setConfirmed({
        id: res.data.data.id,
        cat_name: res.data.data.nom_chat,
      });

      setForm(emptyForm);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;

      if (apiErrors) {
        const mapped: Partial<Record<keyof FormState, string>> = {};

        Object.entries(apiErrors).forEach(([key, msgs]) => {
          mapped[key as keyof FormState] = Array.isArray(msgs)
            ? (msgs[0] as string)
            : String(msgs);
        });

        setErrors(mapped);
      } else {
        setServerError(
          "La réservation n'a pas pu être envoyée. Réessayez dans un instant."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl font-bold text-green-600">
                ✓
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Réservation enregistrée
            </h1>

            <p className="mt-4 text-sm sm:text-base leading-7 text-slate-600">
              La demande pour{" "}
              <strong className="font-semibold text-slate-900">
                {confirmed.cat_name}
              </strong>{" "}
              a bien été reçue (référence n°{confirmed.id}). Nous vous
              appelons pour confirmer les dates.
            </p>

            <button
              type="button"
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              onClick={() => setConfirmed(null)}
            >
              Faire une nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
            Pension pour chats
          </p>

          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Réservez un séjour pour votre chat
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-slate-600">
            Quelques informations sur votre compagnon et vos dates de séjour,
            et nous vous confirmons la disponibilité par téléphone.
          </p>
        </header>

        {/* Form */}
        <form
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Nom du chat */}
            <label className="flex flex-col">
              <span className="mb-2 text-sm font-semibold text-slate-700">
                Nom du chat
              </span>

              <input
                type="text"
                value={form.cat_name}
                onChange={update("cat_name")}
                placeholder="Minette"
                aria-invalid={!!errors.cat_name}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  errors.cat_name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-slate-100"
                }`}
              />

              {errors.cat_name && (
                <em className="mt-1.5 text-xs not-italic text-red-600">
                  {errors.cat_name}
                </em>
              )}
            </label>

            {/* Race */}
            <label className="flex flex-col">
              <span className="mb-2 text-sm font-semibold text-slate-700">
                Race
              </span>

              <input
                type="text"
                value={form.breed}
                onChange={update("breed")}
                placeholder="Européen, Maine Coon…"
                aria-invalid={!!errors.breed}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  errors.breed
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-slate-100"
                }`}
              />

              {errors.breed && (
                <em className="mt-1.5 text-xs not-italic text-red-600">
                  {errors.breed}
                </em>
              )}
            </label>

            {/* Âge */}
            <label className="flex flex-col">
              <span className="mb-2 text-sm font-semibold text-slate-700">
                Âge (en mois)
              </span>

              <input
                type="number"
                min={0}
                max={400}
                value={form.age_months}
                onChange={update("age_months")}
                placeholder="24"
                aria-invalid={!!errors.age_months}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  errors.age_months
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-slate-100"
                }`}
              />

              {errors.age_months && (
                <em className="mt-1.5 text-xs not-italic text-red-600">
                  {errors.age_months}
                </em>
              )}
            </label>

            {/* Téléphone */}
            <label className="flex flex-col">
              <span className="mb-2 text-sm font-semibold text-slate-700">
                Téléphone
              </span>

              <input
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="06 12 34 56 78"
                aria-invalid={!!errors.phone}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  errors.phone
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-slate-100"
                }`}
              />

              {errors.phone && (
                <em className="mt-1.5 text-xs not-italic text-red-600">
                  {errors.phone}
                </em>
              )}
            </label>

            {/* Date d'arrivée */}
            <label className="flex flex-col">
              <span className="mb-2 text-sm font-semibold text-slate-700">
                Date d'arrivée
              </span>

              <input
                type="date"
                min={todayISO()}
                value={form.arrival_date}
                onChange={update("arrival_date")}
                aria-invalid={!!errors.arrival_date}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                  errors.arrival_date
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-slate-100"
                }`}
              />

              {errors.arrival_date && (
                <em className="mt-1.5 text-xs not-italic text-red-600">
                  {errors.arrival_date}
                </em>
              )}
            </label>

            {/* Date de départ */}
            <label className="flex flex-col">
              <span className="mb-2 text-sm font-semibold text-slate-700">
                Date de départ
              </span>

              <input
                type="date"
                min={form.arrival_date || todayISO()}
                value={form.departure_date}
                onChange={update("departure_date")}
                aria-invalid={!!errors.departure_date}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                  errors.departure_date
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-500 focus:ring-slate-100"
                }`}
              />

              {errors.departure_date && (
                <em className="mt-1.5 text-xs not-italic text-red-600">
                  {errors.departure_date}
                </em>
              )}
            </label>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {serverError}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-48"
            >
              {submitting
                ? "Envoi en cours…"
                : "Envoyer la demande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}