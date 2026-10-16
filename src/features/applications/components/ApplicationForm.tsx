import React, { useState } from "react";
import type { Application, Status } from "../types";
import { STATUSES } from "../types";
import { applicationFormSchema, type ApplicationFormData } from "../schema";
import { Button } from "../../../components/Button";

interface ApplicationFormProps {
  initialData?: Application | null;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  onClose: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const isEditing = Boolean(initialData);

  // Form field state
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [role, setRole] = useState(initialData?.role ?? "");
  const [status, setStatus] = useState<Status>(
    initialData?.status ?? "applied",
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [salary, setSalary] = useState(initialData?.salary ?? "");
  const [link, setLink] = useState(initialData?.link ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [appliedAt, setAppliedAt] = useState(() => {
    if (initialData?.appliedAt) {
      return initialData.appliedAt.slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  });
  const [followUpAt, setFollowUpAt] = useState(() => {
    if (initialData?.followUpAt) {
      return initialData.followUpAt.slice(0, 10);
    }
    return "";
  });

  // Errors and submission state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Construct raw payload for validation
    let appliedAtIso = "";
    if (appliedAt) {
      try {
        appliedAtIso = new Date(appliedAt + "T12:00:00.000Z").toISOString();
      } catch {
        appliedAtIso = appliedAt;
      }
    }

    let followUpAtIso: string | undefined = undefined;
    if (followUpAt.trim()) {
      try {
        followUpAtIso = new Date(followUpAt + "T12:00:00.000Z").toISOString();
      } catch {
        followUpAtIso = followUpAt;
      }
    }

    const payload = {
      company: company.trim(),
      role: role.trim(),
      status,
      appliedAt: appliedAtIso,
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      link: link.trim() || undefined,
      followUpAt: followUpAtIso,
      notes: notes.trim() || undefined,
    };

    const result = applicationFormSchema.safeParse(payload);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        if (path && !errors[path]) {
          errors[path] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
      onClose();
    } catch (err) {
      console.error("Failed to save application:", err);
      setFieldErrors({
        submit: "Failed to save application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {fieldErrors.submit && (
        <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          {fieldErrors.submit}
        </div>
      )}

      {/* Company & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Company Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Corp"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-colors ${
              fieldErrors.company
                ? "border-rose-300 focus:ring-rose-400 text-rose-900"
                : "border-slate-300 focus:ring-indigo-500 text-slate-900"
            }`}
            aria-invalid={Boolean(fieldErrors.company)}
            aria-describedby={
              fieldErrors.company ? "company-error" : undefined
            }
          />
          {fieldErrors.company && (
            <p id="company-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.company}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Role / Position <span className="text-rose-500">*</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Full Stack Developer"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-colors ${
              fieldErrors.role
                ? "border-rose-300 focus:ring-rose-400 text-rose-900"
                : "border-slate-300 focus:ring-indigo-500 text-slate-900"
            }`}
            aria-invalid={Boolean(fieldErrors.role)}
            aria-describedby={fieldErrors.role ? "role-error" : undefined}
          />
          {fieldErrors.role && (
            <p id="role-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.role}
            </p>
          )}
        </div>
      </div>

      {/* Status & Applied Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Status <span className="text-rose-500">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="appliedAt"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Date Applied <span className="text-rose-500">*</span>
          </label>
          <input
            id="appliedAt"
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-colors ${
              fieldErrors.appliedAt
                ? "border-rose-300 focus:ring-rose-400 text-rose-900"
                : "border-slate-300 focus:ring-indigo-500 text-slate-900"
            }`}
            aria-invalid={Boolean(fieldErrors.appliedAt)}
            aria-describedby={
              fieldErrors.appliedAt ? "appliedAt-error" : undefined
            }
          />
          {fieldErrors.appliedAt && (
            <p id="appliedAt-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.appliedAt}
            </p>
          )}
        </div>
      </div>

      {/* Location & Salary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Location{" "}
            <span className="text-xs text-slate-400 font-normal">
              (Optional)
            </span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Remote, New York, NY"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Salary / Compensation{" "}
            <span className="text-xs text-slate-400 font-normal">
              (Optional)
            </span>
          </label>
          <input
            id="salary"
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g. $120,000 or £60k - £75k"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>
      </div>

      {/* Link & Follow-Up Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Job Posting Link{" "}
            <span className="text-xs text-slate-400 font-normal">
              (Optional)
            </span>
          </label>
          <input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com/jobs/123"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 transition-colors ${
              fieldErrors.link
                ? "border-rose-300 focus:ring-rose-400 text-rose-900"
                : "border-slate-300 focus:ring-indigo-500 text-slate-900"
            }`}
            aria-invalid={Boolean(fieldErrors.link)}
            aria-describedby={fieldErrors.link ? "link-error" : undefined}
          />
          {fieldErrors.link && (
            <p id="link-error" className="mt-1 text-xs text-rose-600">
              {fieldErrors.link}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="followUpAt"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Follow-Up Reminder{" "}
            <span className="text-xs text-slate-400 font-normal">
              (Optional)
            </span>
          </label>
          <input
            id="followUpAt"
            type="date"
            value={followUpAt}
            onChange={(e) => setFollowUpAt(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Notes / Context{" "}
          <span className="text-xs text-slate-400 font-normal">
            (Optional)
          </span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Interview stage details, recruiter name, referral info, tech stack notes..."
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditing ? "Save Changes" : "Add Application"}
        </Button>
      </div>
    </form>
  );
};
