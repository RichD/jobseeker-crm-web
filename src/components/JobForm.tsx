import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";

function JobForm() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  interface Job {
    title: string;
    company: string;
    location?: string;
    url?: string;
    status?: string;
    description?: string;
    notes?: string;
    compensation?: string;
    applied_at?: string;
  }

  const [job, setJob] = useState<Job>({
    title: "",
    company: "",
    location: "",
    url: "",
    status: "saved",
    description: "",
    notes: "",
    compensation: "",
    applied_at: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        const response = await fetch(`${API_URL}/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        setJob({
          title: data.job.title ?? "",
          company: data.job.company ?? "",
          location: data.job.location ?? "",
          url: data.job.url ?? "",
          status: data.job.status ?? "saved",
          description: data.job.description ?? "",
          notes: data.job.notes ?? "",
          compensation: data.job.compensation ?? "",
          applied_at: data.job.applied_at ?? "",
        });
      };
      fetchJob();
    }
  }, [id, API_URL, token]);

  const saveJob = async () => {
    setErrors({});

    const method = id ? "PATCH" : "POST";
    const url = id ? `${API_URL}/jobs/${id}` : `${API_URL}/jobs`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job }),
    });

    const data = await response.json();

    if (data.errors) {
      setErrors(data.errors);
    } else {
      navigate("/jobs");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveJob();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      navigate("/jobs");
    } else {
      alert("Failed to delete job");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {id ? job.title || "Edit Job" : "New Job"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.title}
                onChange={handleChange}
              />
              {errors.title && errors.title.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.title.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company
              </label>
              <input
                id="company"
                type="text"
                name="company"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.company}
                onChange={handleChange}
              />
              {errors.company && errors.company.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.company.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.location}
                onChange={handleChange}
              />
              {errors.location && errors.location.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.location.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL
              </label>
              <input
                id="url"
                type="text"
                name="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.url}
                onChange={handleChange}
              />
              {errors.url && errors.url.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.url.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.status}
                onChange={handleChange}
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              {errors.status && errors.status.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.status.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.description}
                onChange={handleChange}
                rows={4}
              />
              {errors.description && errors.description.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.description.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.notes}
                onChange={handleChange}
                rows={4}
              />
              {errors.notes && errors.notes.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.notes.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="compensation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Compensation
              </label>
              <input
                id="compensation"
                type="text"
                name="compensation"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.compensation}
                onChange={handleChange}
              />
              {errors.compensation && errors.compensation.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.compensation.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="applied_at"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Applied Date
              </label>
              <input
                id="applied_at"
                type="date"
                name="applied_at"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={job.applied_at}
                onChange={handleChange}
              />
              {errors.applied_at && errors.applied_at.length > 0 && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.applied_at.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {id ? "Update" : "Create"}
              </button>

              <Link
                to="/jobs"
                className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors
  text-center"
              >
                Cancel
              </Link>

              {id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 border-2 border-red-300 text-red-700 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default JobForm;
