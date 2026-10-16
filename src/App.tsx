import { useState } from "react";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import {
  ApplicationList,
  ApplicationForm,
  useApplications,
  type Application,
  type ApplicationFormData,
} from "./features/applications";

function App() {
  const {
    applications,
    isLoading,
    addApplication,
    editApplication,
    deleteApplication,
    loadSampleData,
    clearAllApplications,
  } = useApplications();

  // Modal & Edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  const handleOpenAdd = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setEditingApplication(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const handleFormSubmit = async (data: ApplicationFormData) => {
    if (editingApplication) {
      await editApplication({
        ...editingApplication,
        ...data,
      });
    } else {
      await addApplication(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 mb-4 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          Loading your job applications…
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Accessing local IndexedDB storage
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header
        totalCount={applications.length}
        onAddNew={handleOpenAdd}
      />

      {/* Main Content Area with Responsive Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicationList
          applications={applications}
          onAddNew={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={deleteApplication}
          onLoadSampleData={loadSampleData}
          onClearAll={clearAllApplications}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Job Tracker &middot; Front-only offline-first application with
            IndexedDB persistence.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Local IndexedDB Connected
            </span>
          </div>
        </div>
      </footer>

      {/* Application Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingApplication
            ? `Edit Application: ${editingApplication.company}`
            : "Add Job Application"
        }
        description={
          editingApplication
            ? "Update status, salary, interview dates, or notes."
            : "Fill in the position and company details to track this application."
        }
      >
        <ApplicationForm
          initialData={editingApplication}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default App;
