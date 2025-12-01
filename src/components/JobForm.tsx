import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import { apiFetch } from "@/utils/api";
import { type Job } from "@/types/job";
import { type Skill } from "@/types/skill";
import { type JobSkill } from "@/types/job_skill";
import { JOB_STATUSES, JOB_SKILL_CLASSIFICATIONS } from "@/constants/jobs";

import Navbar from "./layout/Navbar";

function JobForm() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

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
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<Skill[]>([]);
  const [selectedClassifications, setSelectedClassifications] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      const response = await apiFetch(`${API_URL}/jobs/${id}`, {
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

    const fetchJobSkills = async () => {
      const response = await apiFetch(`${API_URL}/jobs/${id}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setJobSkills(data.skills);
      return data.skills; // return so we can check length
    };

    const fetchSuggestedSkills = async () => {
      const response = await apiFetch(
        `${API_URL}/jobs/${id}/skills?suggest=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSuggestedSkills(data.suggested_skills);
    };

    const loadJobData = async () => {
      await fetchJob();
      const skills = await fetchJobSkills();
      if (skills.length === 0) {
        await fetchSuggestedSkills();
      }
    };

    loadJobData();
  }, [id, API_URL, token]);

  const saveJob = async () => {
    setErrors({});

    const method = id ? "PATCH" : "POST";
    const url = id ? `${API_URL}/jobs/${id}` : `${API_URL}/jobs`;

    const response = await apiFetch(url, {
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

    const response = await apiFetch(`${API_URL}/jobs/${id}`, {
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

  const handleAddSkill = async (skillId: number, classification: string) => {
    const response = await apiFetch(`${API_URL}/jobs/${id}/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        skills: [
          {
            skill_id: skillId,
            classification: classification,
            years_required: null,
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setJobSkills([...jobSkills, ...data.job_skills]);
      setSuggestedSkills(suggestedSkills.filter((s) => s.id !== skillId));
    } else {
      alert("Failed to add skill");
    }
  };

  const handleRemoveSkill = async (jobSkillId: number) => {
    const response = await apiFetch(
      `${API_URL}/jobs/${id}/skills/${jobSkillId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const updatedSkills = jobSkills.filter((js) => js.id !== jobSkillId);
      setJobSkills(updatedSkills);

      // Re-fetch suggestions if we just removed the last skill
      if (updatedSkills.length === 0) {
        const suggestResponse = await apiFetch(
          `${API_URL}/jobs/${id}/skills?suggest=true`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await suggestResponse.json();
        setSuggestedSkills(data.suggested_skills);
      }
    } else {
      alert("Failed to remove skill");
    }
  };

  const handleAddAllSkills = async () => {
    const skillsToAdd = suggestedSkills.map((skill) => ({
      skill_id: skill.id!,
      classification: selectedClassifications[skill.id!] || "required",
      years_required: null,
    }));

    const response = await apiFetch(`${API_URL}/jobs/${id}/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skills: skillsToAdd }),
    });

    if (response.ok) {
      const data = await response.json();
      setJobSkills([...jobSkills, ...data.job_skills]);
      setSuggestedSkills([]);
    } else {
      alert("Failed to add all skills");
    }
  };

  const handleRemoveAllSkills = async () => {
    if (
      !window.confirm(
        `Are you sure you want to remove all ${jobSkills.length} skills?`
      )
    ) {
      return;
    }

    const deletePromises = jobSkills.map((jobSkill) =>
      apiFetch(`${API_URL}/jobs/${id}/skills/${jobSkill.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    const results = await Promise.all(deletePromises);
    const allSuccessful = results.every((r) => r.ok);

    if (allSuccessful) {
      setJobSkills([]);
      // Re-fetch suggestions
      const suggestResponse = await apiFetch(
        `${API_URL}/jobs/${id}/skills?suggest=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await suggestResponse.json();
      setSuggestedSkills(data.suggested_skills);
    } else {
      alert("Failed to remove some skills");
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

              {id && job.url && (
                <div className="mb-4">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View original job posting →
                  </a>
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
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
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

          {id && jobSkills.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Current Skills ({jobSkills.length})
                </h3>
                <button
                  type="button"
                  onClick={handleRemoveAllSkills}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove All
                </button>
              </div>
              {jobSkills.map((jobSkill) => (
                <div
                  key={jobSkill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <span className="font-medium">{jobSkill.skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {jobSkill.classification}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        jobSkill.id && handleRemoveSkill(jobSkill.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {id && suggestedSkills.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Suggested Skills ({suggestedSkills.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddAllSkills}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Add All
                </button>
              </div>
              {suggestedSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-white border rounded"
                >
                  <span>{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <select
                      className="px-2 py-1 border rounded text-sm"
                      value={
                        selectedClassifications[skill.id!] || "required"
                      }
                      onChange={(e) =>
                        setSelectedClassifications({
                          ...selectedClassifications,
                          [skill.id!]: e.target.value,
                        })
                      }
                    >
                      {JOB_SKILL_CLASSIFICATIONS.map((classification) => (
                        <option key={classification} value={classification}>
                          {classification}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddSkill(
                          skill.id!,
                          selectedClassifications[skill.id!] || "required"
                        )
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default JobForm;
