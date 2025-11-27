import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

function Jobs() {
  interface Job {
    id: number;
    title: string;
    company: string;
    status: string;
    url: string | null;
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const buildQuery = () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("q", searchTerm);
      if (status) params.append("status", status);
      return params.toString() ? `?${params.toString()}` : "";
    };

    const query = buildQuery();

    const fetchJobs = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      const response = await apiFetch(`${API_URL}/jobs${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setJobs(data.jobs || []);
      setLoading(false);
    };

    fetchJobs();
  }, [searchTerm, status]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 p-8">
          <p>Loading jobs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Jobs</h1>

          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />

          <div>
            <label htmlFor="status">Status: </label>
            <select
              id="status"
              name="status"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value=""></option>
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <Link
            to="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              No jobs yet. Click "New Job" above to get started!
            </p>
          </div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={job.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className="p-3">{job.company}</td>
                  <td className="p-3">{job.status}</td>
                  <td className="p-3">
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Job
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Jobs;
