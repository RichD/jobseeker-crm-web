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
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      const response = await apiFetch(`${API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setJobs(data.jobs || []);
      setLoading(false);
    };

    fetchJobs();
  }, []);

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
                <th>Title</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td>{job.company}</td>
                  <td>{job.status}</td>
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
