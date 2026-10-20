import { useState } from "react";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import {
  KanbanBoard,
  ApplicationList,
  ApplicationForm,
  useApplications,
  type Application,
  type ApplicationFormData,
  type Status,
} from "./features/applications";

function App() {
  const {
    applications,
    isLoading,
    addApplication,
    editApplication,
    deleteApplication,
    reorderApplications,
    moveApplication,
    loadSampleData,
    clearAllApplications,
  } = useApplications();

  // View mode: 'board' (Kanban) or 'list'
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Modal & Edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [newAppDefaultStatus, setNewAppDefaultStatus] = useState<
    Status | undefined
  >(undefined);

  const handleOpenAdd = (status?: Status) => {
    setEditingApplication(null);
    setNewAppDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setEditingApplication(app);
    setNewAppDefaultStatus(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
    setNewAppDefaultStatus(undefined);
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
      <Header totalCount={applications.length} onAddNew={() => handleOpenAdd()} />

      {/* Main Content Area with Responsive Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* View Mode Bar: Board vs List Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {viewMode === "board" ? "Kanban Pipeline" : "Applications Directory"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {viewMode === "board"
                ? "Organize your job search visually. Drag cards across stages."
                : "Search, filter, and sort all your tracked positions."}
            </p>
          </div>

          <div className="flex items-center self-start sm:self-auto bg-slate-200/80 p-1 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "board"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Kanban Board View"
              aria-pressed={viewMode === "board"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              <span>Board</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="List View"
              aria-pressed={viewMode === "list"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>List</span>
            </button>
          </div>
        </div>

        {/* View Content: KanbanBoard or ApplicationList */}
        {viewMode === "board" ? (
          <KanbanBoard
            applications={applications}
            onAddNew={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={deleteApplication}
            onMoveToStatus={moveApplication}
            onReorder={reorderApplications}
            onLoadSampleData={loadSampleData}
            onClearAll={clearAllApplications}
          />
        ) : (
          <ApplicationList
            applications={applications}
            onAddNew={() => handleOpenAdd()}
            onEdit={handleOpenEdit}
            onDelete={deleteApplication}
            onMoveToStatus={moveApplication}
            onLoadSampleData={loadSampleData}
            onClearAll={clearAllApplications}
          />
        )}
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
          defaultStatus={newAppDefaultStatus}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default App;
